import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PageVersionHistory } from '../entities/page-version-history.entity';
import { PageDraft } from 'src/modules/page/entities/page.entity';
import { PageFeatureDraft } from 'src/modules/page-feature/entities/page-feature.entity';
import { PageFeatureService } from 'src/modules/page-feature/services/page-feature.service';
import { PageStatus } from 'src/modules/page/enums/page-status';
import { UpdateOneDto } from '../dtos/update-one.dto';
import { PageOperationHistoryTarget } from 'src/modules/page/entities/page-operation-history';
import { CreateOneDto } from '../dtos/create-one.dto';
import { PageService } from 'src/modules/page/services/page.service';

@Injectable()
export class PageVersionHistoryService {
  constructor(
    @InjectModel(PageVersionHistory.name)
    private pageVersionHistoryModel: Model<PageVersionHistory>,
    @InjectModel(PageDraft.name) private pageDraftModel: Model<PageDraft>,
    @InjectModel(PageFeatureDraft.name)
    private pageFeatureDraftModel: Model<PageFeatureDraft>,
    private readonly pageFeatureService: PageFeatureService,
    private readonly pageService: PageService
  ) {}

  async getAll(pageDraftId: string, userId: string) {
    return await this.pageVersionHistoryModel
      .find({ pageDraftId, createdBy: userId })
      .sort('-_id')
      .select('-page -pageFeatures');
  }

  async getOne(id: string, userId: string) {
    const pageVersionHistory = await this.pageVersionHistoryModel.findOne({
      _id: id,
      createdBy: userId,
    });

    if (!pageVersionHistory) {
      throw new BadRequestException(`Page version history ${id} not found`);
    }

    return pageVersionHistory;
  }

  async createOne(userId: string, createOneDto: CreateOneDto) {
    const { pageDraftId } = createOneDto;

    const pageDraft = await this.pageDraftModel.findOne({
      _id: pageDraftId,
      createdBy: userId,
    });

    if (!pageDraft) {
      throw new BadRequestException(`Page draft ${pageDraftId} not found`);
    }

    const features = await this.pageFeatureDraftModel.find({
      pageId: pageDraftId,
    });

    const updatedAt = new Date();
    updatedAt.setMinutes(updatedAt.getMinutes() - 1);

    const undoHistoryLength = this.pageService.getUndoHistoryLength(
      pageDraft.pageOperationHistories
    );

    const lastTimePagePublishedAt = new Date(pageDraft.lastTimePagePublishedAt);

    const isSavedPage =
      new Date(pageDraft.updatedAt) <= lastTimePagePublishedAt &&
      !!pageDraft.latestRestoredVersion;

    const notFirstTimeSave = !!pageDraft.latestRestoredVersion;

    const isSavedUndo =
      undoHistoryLength === pageDraft.undoCountWhenThePageIsLastPublished;

    const isSavedFeatures =
      features.reduce((acc, { updatedAt }) => {
        return acc + (new Date(updatedAt) > lastTimePagePublishedAt ? 1 : 0);
      }, 0) === 0;

    const isOnlyStatusChange =
      isSavedPage && isSavedUndo && isSavedFeatures && notFirstTimeSave;

    // console.log({
    //   isSavedPage,
    //   isSavedUndo,
    //   isSavedFeatures,
    //   notFirstTimeSave,
    // });

    if (isOnlyStatusChange) {
      await this.pageDraftModel.updateOne(
        { _id: pageDraftId, createdBy: userId },
        {
          status: PageStatus.ACTIVE,
          updatedAt,
          undoCountWhenThePageIsLastPublished: 0,
          lastTimePagePublishedAt: new Date(),
          pageOperationHistories: [],
        },
        { timestamps: { updatedAt: false } }
      );
    } else {
      const filteredPageDraftDocumentClone = this.getFilteredDocumentClone(
        {
          ...pageDraft.toObject(),
          updatedAt,
          undoCountWhenThePageIsLastPublished: undoHistoryLength,
          lastTimePagePublishedAt: new Date(),
        },
        PageOperationHistoryTarget.Page
      ) as PageDraft;

      const pageFeatureDrafts =
        await this.pageFeatureService.getUnpopulatedDraftOneByPage(pageDraftId);

      const filteredPageFeatureDraftsDocumentClone = pageFeatureDrafts.map(
        (pageFeatureDraft) => {
          return this.getFilteredDocumentClone(
            pageFeatureDraft.toObject(),
            PageOperationHistoryTarget.Feature
          ) as PageFeatureDraft;
        }
      );

      const pageVersionHistory = await this.pageVersionHistoryModel.create({
        ...createOneDto,
        pageDraft: filteredPageDraftDocumentClone,
        pageFeatureDrafts: filteredPageFeatureDraftsDocumentClone,
        createdBy: userId,
      });

      await this.pageDraftModel.updateOne(
        { _id: pageDraftId, createdBy: userId },
        {
          status: PageStatus.ACTIVE,
          updatedAt,
          undoCountWhenThePageIsLastPublished: 0,
          lastTimePagePublishedAt: new Date(),
          pageOperationHistories: [],
          latestRestoredVersion: pageVersionHistory._id,
        },
        { timestamps: { updatedAt: false } }
      );
    }

    await this.pageService.replacePageWithDraftPage(pageDraftId, userId);

    const page = await this.pageService.getPopulatedOne(pageDraftId, userId);
    const pageVersionHistories = await this.getAll(pageDraftId, userId);

    return { page, pageVersionHistories };
  }

  async deleteAll(pageDraftId: string, userId: string) {
    await this.pageVersionHistoryModel.deleteMany({
      pageDraftId,
      createdBy: userId,
    });
  }

  async rollback(id: string, userId: string) {
    const pageVersionHistory = await this.getOne(id, userId);

    const pageDraftId = String(pageVersionHistory.pageDraftId);

    const updatedAt = new Date();
    updatedAt.setMinutes(updatedAt.getMinutes() - 1);

    await this.pageDraftModel.updateOne(
      { _id: pageDraftId, createdBy: userId },
      {
        ...pageVersionHistory.pageDraft,
        latestRestoredVersion: id,
        pageCoverPhoto: pageVersionHistory.pageDraft?.pageCoverPhoto ?? null,
        pageProfilePhoto:
          pageVersionHistory.pageDraft?.pageProfilePhoto ?? null,
        status: PageStatus.ACTIVE,
        updatedAt,
        lastTimePagePublishedAt: new Date(),
      },
      { timestamps: { updatedAt: false } }
    );

    await this.pageFeatureDraftModel.deleteMany({
      pageId: pageDraftId,
      createdBy: userId,
    });

    await this.pageFeatureDraftModel.create(
      pageVersionHistory.pageFeatureDrafts
    );

    // await this.deleteAll(pageDraftId, userId);

    return this.getDraftData(pageDraftId, userId);
  }

  async updateOne(id: string, userId: string, updateOneDto: UpdateOneDto) {
    return this.pageVersionHistoryModel
      .findOneAndUpdate({ _id: id, createdBy: userId }, updateOneDto, {
        new: true,
      })
      .select('-page -pageFeatures');
  }

  getFilteredDocumentClone(
    documentClone: PageDraft | PageFeatureDraft,
    target: PageOperationHistoryTarget
  ) {
    switch (target) {
      case PageOperationHistoryTarget.Page: {
        const documentCloneType = documentClone as PageDraft;

        delete documentCloneType.status;
        delete documentCloneType.pageLink;

        delete documentCloneType['id'];
        delete documentCloneType['_id'];
        delete documentCloneType['undoHistoryLength'];
        delete documentCloneType['redoHistoryLength'];

        return documentCloneType;
      }

      case PageOperationHistoryTarget.Feature: {
        const documentCloneType = documentClone as PageFeatureDraft;
        return documentCloneType;
      }
    }
  }

  async getDraftData(pageDraftId: string, userId: string) {
    const { page, features } = await this.pageService.getOneWithFeatures(
      pageDraftId,
      userId
    );

    const pageVersionHistories = await this.getAll(pageDraftId, userId);

    return { page, features, pageVersionHistories };
  }
}

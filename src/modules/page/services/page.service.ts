import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PageDraft, Page } from '../entities/page.entity';
import { Model, Types } from 'mongoose';
import { UserTokenInfo } from 'src/common/auth/types/user-token-info.type';
import { PageCreateDto } from '../dtos/page.create.dto';
import { populate } from 'src/utils/api-features/populate';
import { PageFeatureService } from 'src/modules/page-feature/services/page-feature.service';
import { UpdateThemeDto } from '../dtos/update-theme.dto';
import { UpdatePageDto } from '../dtos/update-page.dto';
import { ENUM_ROLE_TYPE } from 'src/modules/role/constants/role.enum.constant';
import { UpdatePageHeaderDto } from '../dtos/update-page-header.dto';
import {
  PageOperationHistory,
  PageOperationHistoryResetType,
  PageOperationHistoryTarget,
} from '../entities/page-operation-history';
import { PageFeatureDoc } from 'src/modules/page-feature/entities/page-feature.entity';
import { Matomo } from 'src/lib/matomo';
import * as process from 'node:process';
import { UpdatePageLinkDto } from '../dtos/update-page-link.dto';
import { PageStatus } from '../enums/page-status';

@Injectable()
export class PageService {
  constructor(
    @InjectModel(PageDraft.name) private pageDraftModel: Model<PageDraft>,
    @InjectModel(Page.name) private pageModel: Model<Page>,
    private readonly pageFeatureService: PageFeatureService
  ) {}

  isValidPageLink(pageLink: string): boolean {
    const regex = /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/;
    return regex.test(pageLink.trim());
  }

  async createPage(user: UserTokenInfo, pageCreateDto: PageCreateDto) {
    const { pageDescription, pageLink, pageName, pageProfilePhoto } =
      pageCreateDto;

    const updatedLink = pageLink.trim();

    if (!this.isValidPageLink(updatedLink)) {
      throw new BadRequestException(
        'Invalid link. Only numbers, alphabets characters, and dashes are allowed!'
      );
    }

    const existingPageWithProvidedPageLink = await this.pageDraftModel.findOne({
      pageLink: updatedLink,
    });

    if (existingPageWithProvidedPageLink) {
      throw new BadRequestException('Link exists, please choose another one!');
    }

    let mSiteId = '1';
    if (process.env.MATOMO_AUTH_TOKEN) {
      const matomo = new Matomo({
        authToken: process.env.MATOMO_AUTH_TOKEN,
        matomoBaseUrl: process.env.MATOMO_BASE_URL,
      });
      try {
        const createSiteRes = await matomo.CreateSite({
          siteName: `Relik - ${pageName}`,
          // TODO: Add allowed urls
        });
        mSiteId = `${createSiteRes.value}`;
      } catch (err) {
        err.message = 'matomo.CreateSite: ' + err.message;
        console.log(err);
      }
    }

    const updatedAt = new Date();
    updatedAt.setMinutes(updatedAt.getMinutes()) - 1;

    const page = await this.pageDraftModel.create(
      {
        pageDescription,
        pageName,
        pageProfilePhoto,
        createdBy: user?.sub,
        pageLink: updatedLink,
        mSiteId: mSiteId,
        updatedAt,
        lastTimePagePublishedAt: new Date(),
        ...(pageCreateDto.agencyId ? { agencyId: pageCreateDto.agencyId } : {}),
      },
      { timestamps: { updatedAt: false } }
    );

    return page;
  }

  async findAllPagesOfUser(queryParam, user: UserTokenInfo) {
    let queryConditions: any = {};
    if (
      user.role.type === ENUM_ROLE_TYPE.AGENCY_ADMIN ||
      user.role.type === ENUM_ROLE_TYPE.USER_ADMIN
    ) {
      if (queryParam.agencyId) {
        queryConditions = {
          $or: [{ createdBy: user.sub }, { agencyId: queryParam.agencyId }],
        };
      } else {
        queryConditions = { createdBy: user.sub, agencyId: null };
      }
    } else if (user.role.type === ENUM_ROLE_TYPE.SUPER_ADMIN) {
      queryConditions = {};
    } else {
      queryConditions = { createdBy: user.sub };
    }
    if (queryParam?.searchText) {
      queryConditions.$or = [
        { pageName: { $regex: queryParam.searchText, $options: 'i' } },
        { pageLink: { $regex: queryParam.searchText, $options: 'i' } },
      ];
    }
    if (queryParam?.agencyId) {
      queryConditions.agencyId = queryParam?.agencyId;
    }
    if (queryParam?.status) {
      queryConditions.status = queryParam.status;
    }

    let query = this.pageDraftModel
      .find(queryConditions)
      .skip(+queryParam?.pageNumber * +queryParam?.pageSize)
      .limit(+queryParam?.pageSize)
      .sort({ createdAt: -1 });

    query = populate('pageProfilePhoto', query);
    const data = await query;
    const totalCount = await this.pageDraftModel.count(queryConditions);

    return {
      data,
      status: 'success',
      totalCount,
    };
  }

  async getOne(pageId: string, userId: string) {
    const page = await this.pageDraftModel.findOne({
      _id: pageId,
      createdBy: userId,
    });

    if (!page) {
      throw new BadRequestException(`Page ${pageId} not found`);
    }

    return page;
  }

  async getPopulatedOne(pageId: string, userId: string) {
    const page = await this.pageDraftModel
      .findOne({ _id: pageId, createdBy: userId })
      .populate('pageProfilePhoto')
      .populate('pageCoverPhoto')
      .populate('latestRestoredVersion');

    if (!page) {
      throw new BadRequestException(`Page ${pageId} not found`);
    }

    return page;
  }

  async getOneWithFeatures(pageId: string, userId: string) {
    const page = await this.getPopulatedOne(pageId, userId);
    const features = await this.pageFeatureService.getOneByPage(
      String(page._id)
    );
    return { page, features };
  }

  async updateOne(pageId: string, body: UpdatePageDto, userId: string) {
    const page = await this.getOne(pageId, userId);

    await this.pageDraftModel.updateOne(
      { _id: pageId, createdBy: userId },
      body
    );

    const documentClone = page.toObject();

    await this.saveUndoHistory(
      pageId,
      page.pageOperationHistories,
      documentClone,
      PageOperationHistoryResetType.Edit
    );

    return this.getPopulatedOne(pageId, userId);
  }

  async updateTheme(pageId: string, data: UpdateThemeDto, userId: string) {
    const page = await this.getOne(pageId, userId);

    await this.pageDraftModel.updateOne(
      { _id: pageId, createdBy: new Types.ObjectId(userId) },
      { theme: data }
    );

    const documentClone = page.toObject();

    await this.saveUndoHistory(
      pageId,
      page.pageOperationHistories,
      documentClone,
      PageOperationHistoryResetType.Edit
    );

    return this.getPopulatedOne(pageId, userId);
  }

  async updatePageLink(
    pageId: string,
    data: UpdatePageLinkDto,
    userId: string
  ) {
    const updatedLink = data.pageLink.trim();

    if (!this.isValidPageLink(updatedLink)) {
      throw new BadRequestException(
        'Invalid link. Only numbers, alphabets characters, and dashes are allowed!'
      );
    }

    const pageWithLink = await this.pageDraftModel.findOne({
      pageLink: updatedLink,
      _id: { $ne: pageId },
    });

    if (pageWithLink) {
      throw new BadRequestException('Link exists, please choose another one!');
    }

    const page = await this.getOne(pageId, userId);

    await this.pageDraftModel.updateOne(
      { _id: pageId, createdBy: new Types.ObjectId(userId) },
      { pageLink: data.pageLink.trim() }
    );

    const documentClone = page.toObject();

    await this.saveUndoHistory(
      pageId,
      page.pageOperationHistories,
      documentClone,
      PageOperationHistoryResetType.Edit
    );

    return this.getPopulatedOne(pageId, userId);
  }

  async deactivatePage(pageId: string, userId: string) {
    await this.getOne(pageId, userId);

    await this.pageDraftModel.updateOne(
      { _id: pageId, createdBy: userId },
      { status: PageStatus.INACTIVE },
      { timestamps: { updatedAt: false } }
    );

    await this.replacePageWithDraftPage(pageId, userId);

    return this.getPopulatedOne(pageId, userId);
  }

  async updatePageHeader(
    pageId: string,
    body: UpdatePageHeaderDto,
    userId: string
  ) {
    const page = await this.getOne(pageId, userId);

    await this.pageDraftModel.updateOne(
      { _id: pageId, createdBy: new Types.ObjectId(userId) },
      {
        ...(body.pageName ? { pageName: body.pageName } : {}),
        ...(body.pageDescription
          ? { pageDescription: body.pageDescription }
          : {}),
        ...(body.headerLayoutType !== undefined
          ? {
              theme: {
                ...page.theme.toObject(),
                headerLayoutType: body.headerLayoutType,
              },
            }
          : {}),
      }
    );

    const documentClone = page.toObject();

    await this.saveUndoHistory(
      pageId,
      page.pageOperationHistories,
      documentClone,
      PageOperationHistoryResetType.Edit
    );

    return this.getPopulatedOne(pageId, userId);
  }

  async validateByNames(nameOfCelebrities: String[]) {
    const found = await this.pageDraftModel
      .find({
        pageName: { $in: nameOfCelebrities },
      })
      .exec();

    if (found.length > 0) {
      const names = found.map((p) => `'${p.pageName}'`).join(', ');
      throw new BadRequestException(
        `Pages with names: ${names} already exists!`
      );
    }
  }

  async createWithNames(
    userId: Types.ObjectId,
    nameOfCelebrities: String[],
    agencyId: Types.ObjectId
  ) {
    const pages = nameOfCelebrities.map((name) => ({
      pageName: name,
      createdBy: userId,
      agency: agencyId,
    }));

    await this.pageDraftModel.insertMany(pages);
  }

  async getPublicOneWithPublicFeatures(pageLink: String) {
    const page = await this.pageModel
      .findOne({ pageLink })
      .populate('pageProfilePhoto')
      .populate('pageCoverPhoto');

    if (!page) {
      throw new BadRequestException(`Page ${pageLink} could not be found`);
    }

    const features = await this.pageFeatureService.getPublicOneByPage(
      String(page._id)
    );

    return { page, features };
  }

  async replacePageWithDraftPage(pageId: string, userId: string) {
    const page = await this.pageDraftModel.findOne({
      _id: new Types.ObjectId(pageId),
      createdBy: new Types.ObjectId(userId),
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    const publicPage = await this.pageModel.findById(pageId);

    if (publicPage) {
      await this.pageModel.findOneAndReplace(
        { _id: new Types.ObjectId(pageId) },
        { ...page.toObject() }
      );
    } else {
      await this.pageModel.create({
        ...page.toObject(),
        _id: new Types.ObjectId(pageId),
      });
    }

    await this.pageFeatureService.replaceFeaturesWithDraftFeatures(pageId);
  }

  async revertChanges(
    pageId: string,
    userId: string,
    pageOperationHistory: PageOperationHistory
  ) {
    switch (pageOperationHistory.target) {
      case PageOperationHistoryTarget.Page: {
        const prevState = pageOperationHistory.prevState as Partial<
          Omit<
            PageDraft,
            | 'status'
            | 'pageLink'
            | 'pageOperationHistories'
            | 'latestRestoredVersion'
          >
        >;

        switch (pageOperationHistory.resetType) {
          case PageOperationHistoryResetType.Create: {
            // nothing
            break;
          }

          case PageOperationHistoryResetType.Delete: {
            // nothing
            break;
          }

          case PageOperationHistoryResetType.Edit: {
            await this.pageDraftModel.updateOne(
              { _id: pageId },
              {
                ...prevState,
                pageCoverPhoto: prevState?.pageCoverPhoto ?? null,
                pageProfilePhoto: prevState?.pageProfilePhoto ?? null,
              },
              { timestamps: { updatedAt: false } }
            );

            break;
          }
        }
      }

      case PageOperationHistoryTarget.Feature: {
        const prevState = pageOperationHistory.prevState as PageFeatureDoc;

        switch (pageOperationHistory.resetType) {
          case PageOperationHistoryResetType.Create: {
            await this.pageFeatureService.saveOne(prevState);
            break;
          }

          case PageOperationHistoryResetType.Delete: {
            await this.pageFeatureService.removeOne(prevState._id, userId);
            break;
          }

          case PageOperationHistoryResetType.Edit: {
            await this.pageFeatureService.editOne(prevState, userId);
            break;
          }
        }
      }
    }
  }

  getOppositePageOperationHistoryResetType(
    resetType: PageOperationHistoryResetType
  ) {
    if (resetType === PageOperationHistoryResetType.Create) {
      return PageOperationHistoryResetType.Delete;
    }

    if (resetType === PageOperationHistoryResetType.Delete) {
      return PageOperationHistoryResetType.Create;
    }

    return resetType;
  }

  getFilteredDocumentClone(documentClone: PageDraft) {
    if (documentClone['status']) {
      delete documentClone['status'];
    }

    if (documentClone['pageLink']) {
      delete documentClone['pageLink'];
    }

    if (documentClone['pageOperationHistories']) {
      delete documentClone['pageOperationHistories'];
    }

    if (documentClone['undoHistoryLength']) {
      delete documentClone['undoHistoryLength'];
    }

    if (documentClone['redoHistoryLength']) {
      delete documentClone['redoHistoryLength'];
    }

    if (documentClone['latestRestoredVersion']) {
      delete documentClone['latestRestoredVersion'];
    }

    if (documentClone['id']) {
      delete documentClone['id'];
    }

    if (documentClone['_id']) {
      delete documentClone['_id'];
    }

    return documentClone;
  }

  async getDocumentClone(
    pageId: string,
    userId: string,
    pageOperationHistory: PageOperationHistory
  ) {
    switch (pageOperationHistory.resetType) {
      case PageOperationHistoryResetType.Create:
      case PageOperationHistoryResetType.Delete: {
        return pageOperationHistory.prevState;
      }

      case PageOperationHistoryResetType.Edit: {
        switch (pageOperationHistory.target) {
          case PageOperationHistoryTarget.Page: {
            const document = await this.getOne(pageId, userId);
            const documentClone = document.toObject();
            const filteredDocumentClone =
              this.getFilteredDocumentClone(documentClone);

            return filteredDocumentClone;
          }

          case PageOperationHistoryTarget.Feature: {
            const document = await this.pageFeatureService.getOne(
              pageOperationHistory.prevState?.['_id'],
              userId
            );
            const documentClone = document.toObject();
            const filteredDocumentClone =
              this.pageFeatureService.getFilteredDocumentClone(documentClone);

            return filteredDocumentClone;
          }
        }
      }
    }
  }

  getUndoHistoryLength(
    pageOperationHistories: ReadonlyArray<PageOperationHistory>
  ) {
    const index = pageOperationHistories.findIndex(
      (operationHistory) => operationHistory.isActive
    );

    return index + 1;
  }

  async undoOperation(pageId: string, userId: string) {
    const page = await this.getOne(pageId, userId);

    const undoHistoryLength = this.getUndoHistoryLength(
      page.pageOperationHistories
    );

    if (undoHistoryLength === 0) {
      return this.getOneWithFeatures(pageId, userId);
    }

    const index = page.pageOperationHistories.findIndex(
      (operationHistory) => operationHistory.isActive
    );

    const newPageOperationHistories = [...page.pageOperationHistories];
    const lastUndoOperation = newPageOperationHistories.splice(index, 1)[0];
    const filteredDocumentClone = await this.getDocumentClone(
      pageId,
      userId,
      lastUndoOperation
    );

    await this.revertChanges(pageId, userId, lastUndoOperation);

    newPageOperationHistories.push({
      ...lastUndoOperation,
      isActive: false,
      resetType: this.getOppositePageOperationHistoryResetType(
        lastUndoOperation.resetType
      ),
      prevState: filteredDocumentClone,
    });

    if (index !== 0 && newPageOperationHistories[index - 1]) {
      newPageOperationHistories[index - 1] = {
        ...newPageOperationHistories[index - 1],
        isActive: true,
      };
    }

    await this.pageDraftModel.updateOne(
      { _id: pageId },
      { pageOperationHistories: newPageOperationHistories },
      { timestamps: { updatedAt: false } }
    );
    return this.getOneWithFeatures(pageId, userId);
  }

  async redoOperation(pageId: string, userId: string) {
    const page = await this.getOne(pageId, userId);

    const undoHistoryLength = this.getUndoHistoryLength(
      page.pageOperationHistories
    );

    if (page.pageOperationHistories.length - undoHistoryLength === 0) {
      return this.getOneWithFeatures(pageId, userId);
    }

    const index = page.pageOperationHistories.findIndex(
      (operationHistory) => operationHistory.isActive
    );

    const newPageOperationHistories = [...page.pageOperationHistories];
    const lastRedoOperation = newPageOperationHistories.pop();
    const filteredDocumentClone = await this.getDocumentClone(
      pageId,
      userId,
      lastRedoOperation
    );

    await this.revertChanges(pageId, userId, lastRedoOperation);

    newPageOperationHistories.splice(index + 1, 0, {
      ...lastRedoOperation,
      isActive: true,
      resetType: this.getOppositePageOperationHistoryResetType(
        lastRedoOperation.resetType
      ),
      prevState: filteredDocumentClone,
    });

    if (index !== -1 && newPageOperationHistories[index]) {
      newPageOperationHistories[index] = {
        ...newPageOperationHistories[index],
        isActive: false,
      };
    }

    await this.pageDraftModel.updateOne(
      { _id: pageId },
      { pageOperationHistories: newPageOperationHistories },
      { timestamps: { updatedAt: false } }
    );
    return this.getOneWithFeatures(pageId, userId);
  }

  async saveUndoHistory(
    pageId: String,
    pageOperationHistories: ReadonlyArray<PageOperationHistory>,
    documentClone: PageDraft,
    resetType: PageOperationHistoryResetType
  ) {
    const target = PageOperationHistoryTarget.Page;
    const filteredPageOperationHistories: Array<PageOperationHistory> = [
      ...pageOperationHistories,
    ];

    const index = filteredPageOperationHistories.findIndex(
      (operationHistory) => operationHistory.isActive
    );

    filteredPageOperationHistories.splice(index + 1);

    const newPageOperationHistories = filteredPageOperationHistories.map(
      (pageOperationHistory) => ({ ...pageOperationHistory, isActive: false })
    );

    const filteredDocumentClone = this.getFilteredDocumentClone(documentClone);

    newPageOperationHistories.push({
      isActive: true,
      target,
      resetType,
      prevState: filteredDocumentClone,
    });

    await this.pageDraftModel.updateOne(
      { _id: pageId },
      { pageOperationHistories: newPageOperationHistories },
      { timestamps: { updatedAt: false } }
    );
  }
}

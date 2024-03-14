import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import {
  PageFeature,
  PageFeatureDraft,
  PageFeatureDraftDoc,
} from '../entities/page-feature.entity';
import { Connection, Model, Types } from 'mongoose';
import { PageFeatureCreateDto } from '../dtos/page-feature.create.dto';
import { UserTokenInfo } from 'src/common/auth/types/user-token-info.type';
import { FeatureService } from 'src/modules/feature/services/feature.service';
import { ReorderRequestDto } from '../dtos/reorder-request.dto';
import { CopyFeatureDto } from '../dtos/copy-feature.dto';
import { PageFeatureUpdateDto } from '../dtos/page-feature.update.dto';
import { Feature } from 'src/modules/feature/entities/feature.entity';
import { MailService } from 'src/common/mail/services/mail.service';
import { ProcessContactFeatureDto } from '../dtos/process-feature/process-contact-feature.dto';
import { Country } from 'src/modules/country/entities/country.entity';
import {
  PageOperationHistory,
  PageOperationHistoryResetType,
  PageOperationHistoryTarget,
} from 'src/modules/page/entities/page-operation-history';
import { PageDraft } from 'src/modules/page/entities/page.entity';

@Injectable()
export class PageFeatureService {
  constructor(
    private readonly featureService: FeatureService,
    private readonly mailService: MailService,
    @InjectModel(PageDraft.name) private pageDraftModel: Model<PageDraft>,
    @InjectModel(PageFeatureDraft.name)
    private pageFeatureDraftModel: Model<PageFeatureDraft>,
    @InjectModel(PageFeature.name) private pageFeatureModel: Model<PageFeature>,
    @InjectModel(Country.name) private countryModel: Model<Country>,
    @InjectConnection() private readonly connection: Connection
  ) {}

  async getOne(pageFeatureId: string, userId: string) {
    const pageFeature = await this.pageFeatureDraftModel.findOne({
      _id: pageFeatureId,
      createdBy: userId,
    });

    if (!pageFeature) {
      throw new NotFoundException(`Page feature ${pageFeatureId} not found`);
    }

    return pageFeature;
  }

  async getPopulatedOne(pageFeatureId: string, userId: string) {
    const pageFeature = await this.pageFeatureDraftModel
      .findOne({
        _id: pageFeatureId,
        createdBy: userId,
      })
      .populate('featureId')
      .populate('values.whatsAppLinkValues.phone.country')
      .populate('values.callLinkValues.phone.country')
      .populate('values.smsLinkValues.phone.country')
      .populate('values.eventValues.country')
      .populate('values.smsShortCodeValues.shortCodes.country')
      .populate('values.socialHandlesValues.whatsAppLink.country')
      .populate('values.socialHandlesValues.telegramLink.country')
      .exec();

    if (!pageFeature) {
      throw new NotFoundException(`Page feature ${pageFeatureId} not found`);
    }

    return pageFeature;
  }

  async getOneByPage(pageId: string) {
    const pageFeatures = await this.pageFeatureDraftModel
      .find({ pageId })
      .populate('featureId')
      .populate('values.whatsAppLinkValues.phone.country')
      .populate('values.callLinkValues.phone.country')
      .populate('values.smsLinkValues.phone.country')
      .populate('values.eventValues.country')
      .populate('values.smsShortCodeValues.shortCodes.country')
      .populate('values.socialHandlesValues.whatsAppLink.country')
      .populate('values.socialHandlesValues.telegramLink.country')
      .sort({ order: 1 });

    return pageFeatures.filter((pageFeature) => {
      const feature = pageFeature.featureId as unknown as Feature;
      return feature.isVisible !== false;
    });
  }

  async getPublicOneByPage(pageId: string) {
    const pageFeatures = await this.pageFeatureModel
      .find({ pageId })
      .populate('featureId')
      .populate('values.whatsAppLinkValues.phone.country')
      .populate('values.callLinkValues.phone.country')
      .populate('values.smsLinkValues.phone.country')
      .populate('values.eventValues.country')
      .populate('values.smsShortCodeValues.shortCodes.country')
      .populate('values.socialHandlesValues.whatsAppLink.country')
      .populate('values.socialHandlesValues.telegramLink.country')
      .sort({ order: 1 });

    return pageFeatures.filter((pageFeature) => {
      const feature = pageFeature.featureId as unknown as Feature;
      return feature.isVisible !== false;
    });
  }

  async getUnpopulatedPublicOneByPage(pageId: string) {
    const pageFeatures = await this.pageFeatureModel
      .find({ pageId })
      .sort({ order: 1 });

    return pageFeatures.filter((pageFeature) => {
      const feature = pageFeature.featureId as unknown as Feature;
      return feature.isVisible !== false;
    });
  }

  async getUnpopulatedDraftOneByPage(pageId: string) {
    const pageFeatures = await this.pageFeatureDraftModel
      .find({ pageId })
      .sort({ order: 1 });

    return pageFeatures.filter((pageFeature) => {
      const feature = pageFeature.featureId as unknown as Feature;
      return feature.isVisible !== false;
    });
  }

  async createOne(pageFeature: PageFeatureCreateDto, user: UserTokenInfo) {
    const feature = await this.featureService.findByComponent(
      pageFeature.feature
    );

    if (!feature) {
      return new NotFoundException('feature not found');
    }

    const lastFeat = await this.pageFeatureDraftModel
      .findOne({ pageId: pageFeature.pageId, createdBy: user.sub })
      .sort({ order: -1 });

    let order = lastFeat?.order + 1 || 1;

    if (pageFeature.order !== undefined) {
      if (pageFeature.order > lastFeat?.order + 1 || pageFeature.order <= 0) {
        throw new BadRequestException('Out of bound for order property');
      }

      await this.pageFeatureDraftModel.updateMany(
        { pageId: pageFeature.pageId, order: { $gte: pageFeature.order } },
        { $inc: { order: 1 } },
        { timestamps: { updatedAt: false } }
      );

      order = pageFeature.order;
    }

    const createdPageFeature = await this.pageFeatureDraftModel.create({
      pageId: pageFeature.pageId,
      order: order,
      featureId: feature._id,
      values: pageFeature.values,
      createdBy: user.sub,
    });

    const documentClone = createdPageFeature.toObject();

    await this.saveNewOperationHistory(
      String(createdPageFeature.pageId),
      documentClone,
      PageOperationHistoryResetType.Delete
    );

    return this.getOneByPage(pageFeature.pageId);
  }

  async updateOne(
    pageFeatureUpdateDto: PageFeatureUpdateDto,
    user: UserTokenInfo
  ) {
    const pageFeature = await this.getOne(pageFeatureUpdateDto.id, user.sub);

    await this.pageFeatureDraftModel.updateOne(
      { _id: pageFeatureUpdateDto.id, createdBy: user.sub },
      { $set: { values: pageFeatureUpdateDto.values } }
    );

    const documentClone = pageFeature.toObject();

    await this.saveNewOperationHistory(
      String(pageFeature.pageId),
      documentClone,
      PageOperationHistoryResetType.Edit
    );

    return this.getPopulatedOne(pageFeatureUpdateDto.id, user.sub);
  }

  async reorder(user: UserTokenInfo, body: ReorderRequestDto): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const features = await this.pageFeatureDraftModel
        .find({
          pageId: body.pageId,
          createdBy: user.sub,
        })
        .sort({ order: -1 });

      const featureToMove = features.find((f) => f.id === body.featureId);

      if (features.length > 1 && body.moveTo <= features.length) {
        if (body.moveTo < featureToMove.order) {
          await this.pageFeatureDraftModel.updateMany(
            {
              pageId: body.pageId,
              createdBy: user.sub,
              order: { $lt: featureToMove.order, $gte: body.moveTo },
            },
            { $inc: { order: 1 } },
            { timestamps: { updatedAt: false } }
          );
        } else {
          await this.pageFeatureDraftModel.updateMany(
            {
              pageId: body.pageId,
              createdBy: user.sub,
              order: {
                $gt: featureToMove.order,
                $lte: body.moveTo,
              },
            },
            { $inc: { order: -1 } },
            { timestamps: { updatedAt: false } }
          );
        }

        featureToMove.order = body.moveTo;
        await featureToMove.save();
      }
    } catch (e) {
      await session.abortTransaction();
      throw new BadRequestException(e);
    } finally {
      await session.endSession();
    }
  }

  async deleteOne(user: UserTokenInfo, pageFeatureId: string): Promise<void> {
    const pageFeature = await this.getOne(pageFeatureId, user.sub);

    await this.pageFeatureDraftModel.deleteOne({
      _id: pageFeatureId,
      createdBy: user.sub,
    });

    const documentClone = pageFeature.toObject();

    await this.saveNewOperationHistory(
      String(pageFeature.pageId),
      documentClone,
      PageOperationHistoryResetType.Create
    );

    // await this.pageFeatureDraftModel.updateMany(
    //   { pageId: pageFeature.pageId, order: { $gt: pageFeature.order } },
    //   { $inc: { order: -1 } }
    // );
  }

  async copy(
    user: UserTokenInfo,
    body: CopyFeatureDto
  ): Promise<PageFeatureDraftDoc[]> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const pageFeature = await this.getOne(String(body.featureId), user.sub);

      await this.pageFeatureDraftModel.updateMany(
        {
          pageId: pageFeature.pageId,
          createdBy: user.sub,
          order: { $gt: pageFeature.order },
        },
        { $inc: { order: 1 } },
        { timestamps: { updatedAt: false } }
      );

      const newFeature = pageFeature.toObject();

      const createdPageFeature = await this.pageFeatureDraftModel.create({
        ...newFeature,
        _id: undefined,
        order: pageFeature.order + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const documentClone = createdPageFeature.toObject();

      await this.saveNewOperationHistory(
        String(createdPageFeature.pageId),
        documentClone,
        PageOperationHistoryResetType.Delete
      );

      return this.getOneByPage(String(pageFeature.pageId));
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      await session.endSession();
    }
  }

  async replaceFeaturesWithDraftFeatures(pageId: string) {
    await this.pageFeatureModel.deleteMany({ pageId });

    const pageFeatures = await this.pageFeatureDraftModel.find({
      pageId: new Types.ObjectId(pageId),
    });

    await this.pageFeatureModel.insertMany(
      pageFeatures.map((feature) => feature.toObject())
    );
  }

  getFilteredDocumentClone(documentClone: PageFeatureDraft) {
    return documentClone;
  }

  async saveNewOperationHistory(
    pageId: String,
    documentClone: PageFeature,
    resetType: PageOperationHistoryResetType
  ) {
    const target = PageOperationHistoryTarget.Feature;

    const { pageOperationHistories } =
      await this.pageDraftModel.findById(pageId);

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

  async editOne(pageFeature: PageFeatureDraftDoc, userId: string) {
    await this.pageFeatureDraftModel.updateOne(
      { _id: pageFeature._id, createdBy: userId },
      pageFeature,
      { timestamps: { updatedAt: false } }
    );
  }

  async removeOne(pageFeatureId: string, userId: string): Promise<void> {
    // const pageFeature = await this.getOne(pageFeatureId, userId);

    await this.pageFeatureDraftModel.deleteOne(
      {
        _id: pageFeatureId,
        createdBy: userId,
      },
      { timestamps: false }
    );

    // await this.pageFeatureDraftModel.updateMany(
    //   { pageId: pageFeature.pageId, order: { $gt: pageFeature.order } },
    //   { $inc: { order: -1 } },
    //   { timestamps: false }
    // );
  }

  async saveOne(
    pageFeature: PageFeatureDraftDoc
    // userId: string
  ): Promise<void> {
    // const lastFeat = await this.pageFeatureDraftModel
    //   .findOne({ pageId: pageFeature.pageId, createdBy: userId })
    //   .sort({ order: -1 });

    // if (pageFeature.order > lastFeat?.order + 1 || pageFeature.order <= 0) {
    //   throw new BadRequestException('Out of bound for order property');
    // }

    // await this.pageFeatureDraftModel.updateMany(
    //   { pageId: pageFeature.pageId, order: { $gte: pageFeature.order } },
    //   { $inc: { order: 1 }, updatedAt: false },
    //   {}
    // );

    await this.pageFeatureDraftModel.create({
      ...pageFeature,
      createdAt: new Date(pageFeature.createdAt),
      updatedAt: new Date(pageFeature.updatedAt),
    });
  }

  async processContactFeature(
    processContactFeatureDto: ProcessContactFeatureDto
  ) {
    const feature = await this.pageFeatureModel.findOne({
      _id: processContactFeatureDto.pageFeatureId,
    });

    if (!feature) {
      throw new NotFoundException('Feature not found');
    }

    const recipientEmail = feature.values.contactValues.emailAddress;

    let country: string;
    let mobile: string;

    if (processContactFeatureDto.country) {
      const curCountry = await this.countryModel.findOne({
        _id: processContactFeatureDto.country,
      });

      if (curCountry) country = curCountry.name;
    }

    if (processContactFeatureDto?.phone?.country) {
      const curCountry = await this.countryModel.findOne({
        _id: processContactFeatureDto.phone.country,
      });

      if (curCountry)
        mobile = `${curCountry.dial_code}${processContactFeatureDto.phone.number}`;
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Template</title>
    </head>
    <body>
      <h2>Contact feature information</h2>

      ${
        processContactFeatureDto.name
          ? `<p><strong>Name:</strong> ${processContactFeatureDto.name}</p>`
          : ''
      }

      ${
        processContactFeatureDto.emailAddress
          ? `<p><strong>Email address:</strong> ${processContactFeatureDto.emailAddress}</p>`
          : ''
      }

      ${country ? `<p><strong>Country:</strong> ${country}</p>` : ''}

      ${mobile ? `<p><strong>Mobile:</strong> ${mobile}</p>` : ''}

      ${
        processContactFeatureDto.message
          ? `<p><strong>Message:</strong> ${processContactFeatureDto.message}</p>`
          : ''
      }
    </body>
    </html>
    `;

    const isSuccessful = await this.mailService.sendMail(
      recipientEmail,
      'Contact feature',
      htmlContent
    );

    if (!isSuccessful) {
      throw new BadRequestException('Something went wrong');
    }

    if (processContactFeatureDto.emailAddress) {
      const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Template</title>
      </head>
      <body>
        <h1>${
          feature.values.contactValues.thankYouMessage ??
          'Thank you for your interest!'
        }</h1>
      </body>
      </html>
      `;

      const isSuccessful = await this.mailService.sendMail(
        processContactFeatureDto.emailAddress,
        'Thank you',
        htmlContent
      );

      if (!isSuccessful) {
        throw new BadRequestException('Something went wrong');
      }
    }

    return { success: true };
  }
}

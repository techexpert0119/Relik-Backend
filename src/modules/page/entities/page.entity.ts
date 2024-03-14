import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types, Document } from 'mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { File } from '../../file/entities/file.entity';
import { PageTheme } from './page-theme.entity';
import { PageStatus } from '../enums/page-status';
import { User } from '../../user/entities/user.entity';
import { PageOperationHistory } from './page-operation-history';

export const PageDraftsCollectionName = 'pageDrafts';
export const PagesCollectionName = 'pages';

class PageBase extends DatabaseMongoUUIDEntityAbstract {
  @Prop({ required: true, type: String, index: true })
  pageName: string;

  @Prop({ type: Boolean, default: false })
  isPublic: boolean;

  @Prop({ type: String, maxlength: 100 })
  pageLink: string;

  @Prop({ type: String })
  pageDescription: string;

  @Prop({ type: Types.ObjectId, ref: File.name, required: false })
  pageProfilePhoto?: string;

  @Prop({ type: Types.ObjectId, ref: File.name, required: false })
  pageCoverPhoto?: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  createdBy: string;

  @Prop({ type: PageTheme, default: () => ({}) })
  theme: PageTheme & Document;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Agency' })
  agencyId: Types.ObjectId;

  @Prop({
    required: true,
    type: String,
    enum: PageStatus,
    default: PageStatus.INACTIVE,
  })
  status: PageStatus;

  @Prop({ type: Date, required: true })
  lastTimePagePublishedAt: Date;

  @Prop({ type: String })
  mSiteId: string;
}

@DatabaseEntity({
  collection: PageDraftsCollectionName,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class PageDraft extends PageBase {
  @Prop({ default: [] })
  pageOperationHistories: ReadonlyArray<PageOperationHistory>;

  @Prop({ type: Number })
  undoCountWhenThePageIsLastPublished: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PageVersionHistory',
  })
  latestRestoredVersion: Types.ObjectId;
}

export const PageDraftSchema = SchemaFactory.createForClass(PageDraft);

PageDraftSchema.virtual('undoHistoryLength', {
  localField: 'undoHistoryLength',
}).get(function () {
  const index = this.pageOperationHistories.findIndex(
    (operationHistory) => operationHistory.isActive
  );

  return index + 1;
});

PageDraftSchema.virtual('redoHistoryLength', {
  localField: 'redoHistoryLength',
}).get(function () {
  const index = this.pageOperationHistories.findIndex(
    (operationHistory) => operationHistory.isActive
  );

  return Math.max(this.pageOperationHistories.length - index - 1, 0);
});

export type PageDraftDoc = PageDraft & Document;

@DatabaseEntity({
  collection: PagesCollectionName,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Page extends PageBase {}

export const PageYolo = SchemaFactory.createForClass(Page);

export type PageDoc = Page & Document;

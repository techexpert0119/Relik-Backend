import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { Types } from 'mongoose';
import { User } from 'src/modules/user/entities/user.entity';
import { PageDraft } from 'src/modules/page/entities/page.entity';
import { PageFeatureDraft } from 'src/modules/page-feature/entities/page-feature.entity';

export const PageVersionHistoryDatabaseName = 'pageVersionHistory';

@DatabaseEntity({ collection: PageVersionHistoryDatabaseName })
export class PageVersionHistory extends DatabaseMongoUUIDEntityAbstract {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  readonly createdBy: Types.ObjectId;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PageDraft',
    index: true,
  })
  readonly pageDraftId: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  readonly pageDraft: PageDraft;

  @Prop({ type: [mongoose.Schema.Types.Mixed], default: [] })
  readonly pageFeatureDrafts: ReadonlyArray<PageFeatureDraft>;

  @Prop({ type: String })
  readonly title: string;

  @Prop({ type: String })
  readonly description: string;
}

export const PageVersionHistorySchema =
  SchemaFactory.createForClass(PageVersionHistory);
export type PageVersionHistoryDoc = PageVersionHistory & Document;

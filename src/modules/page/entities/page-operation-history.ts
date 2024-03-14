import { Prop, Schema } from '@nestjs/mongoose';
import { PageDraft } from './page.entity';
import { PageFeatureDraft } from 'src/modules/page-feature/entities/page-feature.entity';
import mongoose from 'mongoose';

export enum PageOperationHistoryTarget {
  Page = 'page',
  Feature = 'feature',
}

export enum PageOperationHistoryResetType {
  Edit = 'edit',
  Create = 'create',
  Delete = 'delete',
}

@Schema({ _id: false })
export class PageOperationHistory {
  @Prop({ type: Boolean, default: false })
  readonly isActive: boolean;

  @Prop({ type: String, enum: PageOperationHistoryTarget, required: true })
  readonly target: PageOperationHistoryTarget;

  @Prop({ type: String, enum: PageOperationHistoryResetType, required: true })
  readonly resetType: PageOperationHistoryResetType;

  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  readonly prevState:
    | Partial<
        Omit<
          PageDraft,
          | 'status'
          | 'pageLink'
          | 'pageOperationHistories'
          | 'latestRestoredVersion'
        >
      >
    | Partial<PageFeatureDraft>;
}

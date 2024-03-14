import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PageVersionHistory,
  PageVersionHistorySchema,
} from './entities/page-version-history.entity';
import { PageVersionHistoryService } from './services/page-version-history.service';
import { PageDraft, PageDraftSchema } from '../page/entities/page.entity';
import {
  PageFeatureDraft,
  PageFeatureDraftSchema,
} from '../page-feature/entities/page-feature.entity';
import { PageFeatureModule } from '../page-feature/page-feature.module';
import { PageModule } from '../page/page.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PageDraft.name, schema: PageDraftSchema },
      { name: PageFeatureDraft.name, schema: PageFeatureDraftSchema },
      { name: PageVersionHistory.name, schema: PageVersionHistorySchema },
    ]),
    PageModule,
    PageFeatureModule,
  ],
  exports: [PageVersionHistoryService],
  providers: [PageVersionHistoryService],
  controllers: [],
})
export class PageVersionHistoryModule {}

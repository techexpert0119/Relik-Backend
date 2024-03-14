import { Module } from '@nestjs/common';
import { PageService } from './services/page.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PageDraft,
  PageDraftSchema,
  Page,
  PageYolo,
} from './entities/page.entity';
import { PageFeatureModule } from '../page-feature/page-feature.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Page.name, schema: PageYolo },
      { name: PageDraft.name, schema: PageDraftSchema },
    ]),
    PageFeatureModule,
  ],
  exports: [PageService],
  providers: [PageService],
  controllers: [],
})
export class PageModule {}

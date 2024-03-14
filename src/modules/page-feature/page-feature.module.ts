import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PageFeature,
  PageFeatureDraft,
  PageFeatureDraftSchema,
  PageFeatureSchema,
} from './entities/page-feature.entity';
import { PageFeatureService } from './services/page-feature.service';
import { FeatureModule } from '../feature/feature.module';
import { MailService } from 'src/common/mail/services/mail.service';
import { Country, CountrySchema } from '../country/entities/country.entity';
import { PageDraft, PageDraftSchema } from '../page/entities/page.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PageDraft.name, schema: PageDraftSchema },
      { name: PageFeatureDraft.name, schema: PageFeatureDraftSchema },
      { name: PageFeature.name, schema: PageFeatureSchema },
      { name: Country.name, schema: CountrySchema },
    ]),
    FeatureModule,
  ],
  exports: [PageFeatureService],
  providers: [PageFeatureService, MailService],
  controllers: [],
})
export class PageFeatureModule {}

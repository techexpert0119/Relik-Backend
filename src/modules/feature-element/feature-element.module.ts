import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FeatureElement,
  FeatureElementSchema,
} from './entities/feature-element.entity';
import { FeatureElementService } from './services/feature-element.service';
import { GetFeatureElementsQueryHandler } from './queries/get-all-feature-elements.query';
import { CqrsModule } from '@nestjs/cqrs';
import { FeatureElementController } from './controller/feature-element.controller';

const toExportAndProvide = [
  FeatureElementService,
  GetFeatureElementsQueryHandler,
];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: FeatureElement.name, schema: FeatureElementSchema },
    ]),
  ],
  exports: [...toExportAndProvide],
  providers: [...toExportAndProvide],
  controllers: [FeatureElementController],
})
export class FeatureElementModule {}

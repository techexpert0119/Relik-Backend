import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FeatureGroup,
  FeatureGroupSchema,
} from './entities/feature-group.entity';
import { FeatureGroupService } from './services/feature-group.service';
import { GetFeatureGroupsQueryHandler } from './queries/get-all-feaute-groups.query';
import { CqrsModule } from '@nestjs/cqrs';
import { FeatureGroupController } from './controller/feature-group.controller';

const toExportAndProvide = [FeatureGroupService, GetFeatureGroupsQueryHandler];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: FeatureGroup.name, schema: FeatureGroupSchema },
    ]),
  ],
  exports: [...toExportAndProvide],
  providers: [...toExportAndProvide],
  controllers: [FeatureGroupController],
})
export class FeatureGroupModule {}

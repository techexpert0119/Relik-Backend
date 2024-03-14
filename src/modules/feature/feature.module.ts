import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeatureService } from './services/feature.service';
import { Feature, FeatureSchema } from './entities/feature.entity';
import { FeatureController } from './controller/feature.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Feature.name, schema: FeatureSchema }]),
  ],
  exports: [FeatureService],
  providers: [FeatureService],
  controllers: [FeatureController],
})
export class FeatureModule {}

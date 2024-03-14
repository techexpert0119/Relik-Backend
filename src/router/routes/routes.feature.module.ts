import { Module } from '@nestjs/common';
import { FeatureController } from 'src/modules/feature/controller/feature.controller';
import { FeatureModule } from 'src/modules/feature/feature.module';

@Module({
  controllers: [FeatureController],
  providers: [],
  exports: [],
  imports: [FeatureModule],
})
export class RoutesFetureModule {}

import { Module } from '@nestjs/common';
import { PageFeatureController } from 'src/modules/page-feature/controller/page-feature.controller';
import { PageFeatureModule } from 'src/modules/page-feature/page-feature.module';

@Module({
  controllers: [PageFeatureController],
  providers: [],
  exports: [],
  imports: [PageFeatureModule],
})
export class RoutesPageFetureModule {}

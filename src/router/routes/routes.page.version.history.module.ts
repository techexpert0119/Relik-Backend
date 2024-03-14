import { Module } from '@nestjs/common';
import { PageVersionHistoryController } from 'src/modules/page-version-history/controller/page-version-history.controller';
import { PageVersionHistoryModule } from 'src/modules/page-version-history/page-version-history.module';

@Module({
  controllers: [PageVersionHistoryController],
  providers: [],
  exports: [],
  imports: [PageVersionHistoryModule],
})
export class RoutesPageVersionHistoryModule {}

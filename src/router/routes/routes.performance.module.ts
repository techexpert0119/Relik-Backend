import { Module } from '@nestjs/common';

import { PerformanceModule } from 'src/modules/performance/performance.module';
import { PerformanceController } from 'src/modules/performance/controllers/performance.controller';
import { PageModule } from 'src/modules/page/page.module';

@Module({
  controllers: [PerformanceController],
  providers: [],
  exports: [],
  imports: [PerformanceModule, PageModule],
})
export class RoutesPerformanceModule {}

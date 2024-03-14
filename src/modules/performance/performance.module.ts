import { forwardRef, Module } from '@nestjs/common';

import { PerformanceService } from './services/performance.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [forwardRef(() => UserModule)],
  exports: [PerformanceService],
  providers: [PerformanceService],
  controllers: [],
})
export class PerformanceModule {}

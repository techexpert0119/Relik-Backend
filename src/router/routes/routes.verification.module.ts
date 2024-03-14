import { Module } from '@nestjs/common';
import { VerificationController } from 'src/modules/verification/controllers/varification.controller';
import { VerificationModule } from 'src/modules/verification/verification.module';

@Module({
  controllers: [VerificationController],
  providers: [],
  exports: [],
  imports: [VerificationModule],
})
export class RoutesVerificationModule {}

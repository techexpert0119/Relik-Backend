import { Module } from '@nestjs/common';
import { ValidateEmailService } from './services/validate-email.service';

@Module({
  providers: [ValidateEmailService],
  exports: [ValidateEmailService],
  controllers: [],
  imports: [],
})
export class ValidateEmailModule {}

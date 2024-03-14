import { Module } from '@nestjs/common';
import { AgencyModule } from 'src/modules/agency/agency.module';
import { AgencyController } from 'src/modules/agency/controllers/agency.controller';

@Module({
  controllers: [AgencyController],
  providers: [],
  exports: [],
  imports: [AgencyModule],
})
export class RoutesAgencyModule {}

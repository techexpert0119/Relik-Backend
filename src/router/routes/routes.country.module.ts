import { Module } from '@nestjs/common';
import { CountryController } from 'src/modules/country/controller/country.controller';
import { CountryModule } from 'src/modules/country/feature-group.module';
import { FileController } from 'src/modules/file/controller/file.controller';
import { FileModule } from 'src/modules/file/file.module';

@Module({
  controllers: [CountryController],
  providers: [],
  exports: [],
  imports: [CountryModule],
})
export class RoutesCountryModule {}

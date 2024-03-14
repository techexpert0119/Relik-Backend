import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Country, CountrySchema } from './entities/country.entity';
import { CountryService } from './services/country.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]),
  ],
  exports: [CountryService],
  providers: [CountryService],
  controllers: [],
})
export class CountryModule {}

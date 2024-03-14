import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/abstract/abstract.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country } from '../entities/country.entity';

@Injectable()
export class CountryService extends AbstractService {
  constructor(@InjectModel(Country.name) private countryModel: Model<Country>) {
    super(countryModel);
  }
}

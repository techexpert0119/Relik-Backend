import { buildController } from 'src/abstract/abstract.controller';
import { Controller, Get, Query } from '@nestjs/common';
import { Country } from '../entities/country.entity';
import { CountryUpdateDto } from '../dtos/country.update.dto';
import { CountryCreateDto } from '../dtos/country.create.dto';
import { CountryService } from '../services/country.service';
import { Public } from 'src/common/auth/decorators';

const BaseController = buildController({
  createDto: CountryCreateDto,
  updateDto: CountryUpdateDto,
  model: Country,
  name: 'country',
});
@Controller()
export class CountryController extends BaseController {
  constructor(private readonly countryService: CountryService) {
    super(countryService);
  }

  @Public()
  @Get('public')
  getPublic(@Query() queryParam) {
    return this.countryService.findAll(queryParam);
  }
}

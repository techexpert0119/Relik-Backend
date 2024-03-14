import { PartialType } from '@nestjs/swagger';
import { CountryCreateDto } from './country.create.dto';

export class CountryUpdateDto extends PartialType(CountryCreateDto) {}

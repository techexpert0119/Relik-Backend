import { PartialType } from '@nestjs/swagger';
import { AgencyCreateDto } from './agency.create.dto';

export class AgencyDto extends PartialType(AgencyCreateDto) {
  '_id';
}

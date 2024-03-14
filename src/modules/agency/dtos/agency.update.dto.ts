import { PartialType } from '@nestjs/swagger';
import { AgencyCreateDto } from './agency.create.dto';

export class AgencyUpdateDto extends PartialType(AgencyCreateDto) {}

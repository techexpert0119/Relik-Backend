import { PartialType } from '@nestjs/swagger';
import { FeatureGroupCreateDto } from './feature-group.create.dto';

export class FeatureGroupUpdateDto extends PartialType(FeatureGroupCreateDto) {}

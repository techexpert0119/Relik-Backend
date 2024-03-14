import { PartialType } from '@nestjs/swagger';
import { FeatureElementCreateDto } from './feature-element.create.dto';

export class FeatureElementUpdateDto extends PartialType(
  FeatureElementCreateDto
) {}

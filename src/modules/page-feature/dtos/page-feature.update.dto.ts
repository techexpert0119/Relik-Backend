import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PageFeatureCreateDto } from './page-feature.create.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class PageFeatureUpdateDto extends PartialType(PageFeatureCreateDto) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  id: string;
}

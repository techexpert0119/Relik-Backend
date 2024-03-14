import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ENUM_FEATURES_COMPONENTS_TYPE } from 'src/modules/feature/constants/feature.enum.constant';
import { FeatureValueDto } from './feature-value.dto';

export class PageFeatureCreateDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly pageId: string;

  @ApiProperty()
  readonly order: number;

  @ApiProperty()
  @IsString()
  readonly feature: ENUM_FEATURES_COMPONENTS_TYPE;

  @ApiProperty()
  @IsNotEmpty()
  values: FeatureValueDto;
}

import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ENUM_FEATURES_COMPONENTS_TYPE } from '../constants/feature.enum.constant';

export class FeatureCreateDto {
  @IsNumber()
  @IsEmpty()
  order: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  featureGroup: string;

  featureElement: string;

  @IsString()
  @IsEnum(ENUM_FEATURES_COMPONENTS_TYPE)
  icon: ENUM_FEATURES_COMPONENTS_TYPE;
}

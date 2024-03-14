import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LogoShape } from '../enums/logo-shape';
import { ImageVariant } from '../enums/image-variant';
import { ButtonRadiusVariant } from '../enums/button-radius-variant';
import { ButtonBorderVariant } from '../enums/button-border-variant';
import { ButtonShadowVariant } from '../enums/button-shadow-variant';

export class UpdateThemeDto {
  @IsNotEmpty()
  @IsEnum(LogoShape)
  @ApiProperty({ required: true })
  logoShape: LogoShape;

  @IsString()
  @ApiProperty()
  fontFamily?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  fontColor: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  logoColor: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  background: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(ImageVariant)
  image?: ImageVariant;

  @IsNotEmpty()
  @IsEnum(ButtonRadiusVariant)
  @ApiProperty({ required: true })
  buttonRadius: ButtonRadiusVariant;

  @IsNotEmpty()
  @IsEnum(ButtonBorderVariant)
  @ApiProperty({ required: true })
  buttonBorder: ButtonBorderVariant;

  @IsNotEmpty()
  @IsEnum(ButtonShadowVariant)
  @ApiProperty({ required: true })
  buttonShadow: ButtonShadowVariant;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  buttonFontColor: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  buttonBackground: string;
}

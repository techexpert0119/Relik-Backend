import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

class Field {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  readonly isActive: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  readonly isRequired: string;
}

class Fields {
  @ApiProperty()
  @IsNotEmpty()
  @IsObject({ each: true })
  readonly name: Field;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject({ each: true })
  readonly emailAddress: Field;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject({ each: true })
  readonly mobile: Field;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject({ each: true })
  readonly message: Field;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject({ each: true })
  readonly country: Field;
}

export class ContactValueDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  readonly emailAddress: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly thankYouMessage: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject({ each: true })
  readonly fields: Fields;
}

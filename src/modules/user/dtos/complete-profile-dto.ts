import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ENUM_ROLE_TYPE } from 'src/modules/role/constants/role.enum.constant';

const isAgency = (o: CompleteProfileDto) => o.role === 'AGENCY_ADMIN';

export class CompleteProfileDto {
  @IsNotEmpty()
  @IsEnum(ENUM_ROLE_TYPE)
  @ApiProperty({ required: true })
  readonly role: ENUM_ROLE_TYPE;

  @ApiProperty({ required: true })
  subscriptionId: string;

  @ApiProperty()
  photo: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateIf(isAgency)
  businessName?: string;

  @IsNotEmpty()
  @ApiProperty()
  @ValidateIf(isAgency)
  businessUrl?: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  @ValidateIf(isAgency)
  nameOfCelebrities?: string[];
}

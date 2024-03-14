import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ENUM_ROLE_TYPE } from 'src/modules/role/constants/role.enum.constant';

export class UserProfileCreateDto {
  @IsNotEmpty()
  @IsEnum(ENUM_ROLE_TYPE)
  @ApiProperty({ required: true })
  readonly role: ENUM_ROLE_TYPE;

  @ApiProperty({ required: true })
  subscriptionId: String;

  @ApiProperty()
  photo: String;

  @ApiProperty()
  businessName?: String;

  @ApiProperty()
  businessUrl?: String;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  nameOfCelebrities?: String[];
}

import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { Types } from 'mongoose';
import { ENUM_ROLE_TYPE } from 'src/modules/role/constants/role.enum.constant';
import { ENUM_USER_SIGN_UP_FROM } from 'src/modules/user/constants/user.enum.constant';

export class UserInviteDto {
  @ApiProperty({
    example: faker.internet.email(),
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  @Type(() => String)
  readonly email: string;

  @IsEnum(ENUM_USER_SIGN_UP_FROM)
  @IsString()
  @IsNotEmpty()
  readonly signUpFrom: ENUM_USER_SIGN_UP_FROM;

  @IsEnum(ENUM_ROLE_TYPE)
  @IsString()
  @IsNotEmpty()
  readonly userRole: ENUM_ROLE_TYPE;

  @IsOptional()
  readonly agencyId?: Types.ObjectId;
}

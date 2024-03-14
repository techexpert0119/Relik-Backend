import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsEnum,
} from 'class-validator';
import { ENUM_ROLE_TYPE } from 'src/modules/role/constants/role.enum.constant';
import { ENUM_USER_SIGN_UP_FROM } from 'src/modules/user/constants/user.enum.constant';

export class UserCreateDto {
  @ApiProperty({ example: faker.internet.email(), required: true })
  @IsNotEmpty()
  @Type(() => String)
  readonly email: string;

  @ApiProperty({ example: faker.person.firstName() })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @Type(() => String)
  readonly firstName: string;

  @ApiProperty({
    description: 'string password',
    example: `${faker.string.alphanumeric(5).toLowerCase()}${faker.string
      .alphanumeric(5)
      .toUpperCase()}@@!123`,
  })
  @MaxLength(50)
  readonly password: string;

  @IsEnum(ENUM_USER_SIGN_UP_FROM)
  @IsString()
  @IsNotEmpty()
  readonly signUpFrom: ENUM_USER_SIGN_UP_FROM;

  @IsEnum(ENUM_ROLE_TYPE)
  @IsString()
  @IsNotEmpty()
  readonly userRole: ENUM_ROLE_TYPE;
}

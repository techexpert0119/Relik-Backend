import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UserCreateByInvitationDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  readonly token: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  readonly firstName: string;

  @ApiProperty({
    description: 'string password',
    example: `${faker.string.alphanumeric(5).toLowerCase()}${faker.string
      .alphanumeric(5)
      .toUpperCase()}@@!123`,
    required: true,
  })
  @IsNotEmpty()
  @MaxLength(50)
  readonly password: string;
}

import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

export class UserPasswordResetDto {
  @ApiProperty({
    description: 'string password',
    example: `${faker.string.alphanumeric(5).toLowerCase()}${faker.string
      .alphanumeric(5)
      .toUpperCase()}@@!123`,
  })
  @MaxLength(50)
  readonly oldPassword: string;

  @ApiProperty({
    description: 'string password',
    example: `${faker.string.alphanumeric(5).toLowerCase()}${faker.string
      .alphanumeric(5)
      .toUpperCase()}@@!123`,
  })
  @MaxLength(50)
  readonly newPassword: string;
}

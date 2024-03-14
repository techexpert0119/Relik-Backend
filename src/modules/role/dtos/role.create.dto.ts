import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { PermissionParsingInputData } from 'src/modules/permissions/types/permission.parsing.dto';

import { ENUM_ROLE_TYPE } from 'src/modules/role/constants/role.enum.constant';

export class RoleCreateDto {
  @ApiProperty({
    description: 'Name of role',
    example: faker.person.jobTitle(),
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  readonly name: string;

  @ApiProperty()
  @IsString()
  @Type(() => String)
  readonly description: string;

  @ApiProperty({
    description: 'Representative for role type',
    example: 'ADMIN',
    enum: ENUM_ROLE_TYPE,
    type: ENUM_ROLE_TYPE,
  })
  @IsEnum(ENUM_ROLE_TYPE)
  @IsNotEmpty()
  readonly type: ENUM_ROLE_TYPE;

  @ApiProperty()
  readonly isActive: Boolean;

  @ApiProperty({
    example: [{ action: 'CREATE', type: ['PAGE', 'ADMIN'] }],
  })
  readonly permissions: PermissionParsingInputData;
}

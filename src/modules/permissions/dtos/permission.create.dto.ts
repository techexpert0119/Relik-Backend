import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ENUM_PERMISSION_TYPE } from '../constants/permission.enum.constant';

export class PermissionCreateDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly permissionName: string;
  @ApiProperty()
  @IsString()
  readonly description: string;

  @ApiProperty({
    required: true,
    enum: ENUM_PERMISSION_TYPE,
  })
  @IsString()
  @IsEnum(ENUM_PERMISSION_TYPE)
  readonly permissionEnumType: ENUM_PERMISSION_TYPE;
}

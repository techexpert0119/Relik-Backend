import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UserCreateDto } from './user.create.dto';
import { PermissionParsingInputData } from 'src/modules/permissions/types/permission.parsing.dto';

export class UserUpdateDto extends PartialType(UserCreateDto) {
  @ApiProperty({
    example: [{ action: 'CREATE', type: ['PAGE', 'ADMIN'] }],
  })
  readonly permissions: PermissionParsingInputData;
}

import { Injectable } from '@nestjs/common';
import { RoleService } from 'src/modules/role/services/role.service';

@Injectable()
export class MigrationRoleSeed {
  constructor(private readonly roleService: RoleService) {}
}

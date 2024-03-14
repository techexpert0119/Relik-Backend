import { buildController } from 'src/abstract/abstract.controller';
import { PermissionCreateDto } from '../dtos/permission.create.dto';
import { PermissionUpdateDto } from '../dtos/permission.update.dto';
import { Permission } from '../entities/permission.entity';
import { Controller } from '@nestjs/common';
import { PermissionService } from '../services/permission.service';

const BaseController = buildController({
  createDto: PermissionCreateDto,
  updateDto: PermissionUpdateDto,
  model: Permission,
  name: 'permission',
});
@Controller()
export class PermissionController extends BaseController {
  constructor(private readonly permissionService: PermissionService) {
    super(permissionService);
  }
}

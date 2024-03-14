import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role, RoleDoc } from '../entities/role.entity';
import { ENUM_ROLE_TYPE } from '../constants/role.enum.constant';
import { RoleCreateDto } from '../dtos/role.create.dto';
import { RoleUpdateDto } from '../dtos/role.update.dto';
import { PermissionService } from 'src/modules/permissions/services/permission.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
    private readonly permissionService: PermissionService
  ) {}

  async getAll() {
    return this.roleModel.find({});
  }

  async create(createDto: RoleCreateDto): Promise<RoleDoc> {
    const permissions = this.permissionService.parsePermissionToArray(
      createDto.permissions
    );
    return await this.roleModel.create({ ...createDto, permissions });
  }

  async findOneByType(type: ENUM_ROLE_TYPE): Promise<RoleDoc | undefined> {
    return this.roleModel.findOne({ type });
  }

  async update(id: string, updateDto: RoleUpdateDto) {
    const permissions = this.permissionService.parsePermissionToArray(
      updateDto.permissions
    );
    return this.roleModel.findByIdAndUpdate(id, { ...updateDto, permissions });
  }

  async findOneById(id: Types.ObjectId): Promise<RoleDoc | undefined | null> {
    return this.roleModel.findById(id);
  }
}

import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/abstract/abstract.service';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from '../entities/permission.entity';
import { Model, Types } from 'mongoose';
import { PermissionParsingInputData } from '../types/permission.parsing.dto';

@Injectable()
export class PermissionService extends AbstractService {
  constructor(
    @InjectModel(Permission.name) private permissionModel: Model<Permission>
  ) {
    super(permissionModel);
  }
  parsePermissionToArray(unparsedPermission: PermissionParsingInputData) {
    const permissions = [];
    for (let i = 0; i < unparsedPermission?.length; i++) {
      for (let j = 0; j < unparsedPermission[i].type.length; j++) {
        permissions.push(
          `${unparsedPermission[i].action}_${unparsedPermission[i].type[j]}`
        );
      }
    }
    return permissions;
  }
  async findManyById(idList: Types.ObjectId[]) {
    return await this.permissionModel.find({ _id: { $in: idList } });
  }
}

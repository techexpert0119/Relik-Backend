import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import {
  ENUM_PERMISSION_ACTION,
  ENUM_PERMISSION_TYPE,
} from '../constants/permission.enum.constant';
import { IsEnum } from 'class-validator';

export const PermissionDatabaseName = 'permissions';

@DatabaseEntity({ collection: PermissionDatabaseName })
export class Permission extends DatabaseMongoUUIDEntityAbstract {
  @Prop({
    required: true,
    type: String,
  })
  permissionName: string;

  @Prop({
    type: String,
  })
  description: string;

  @Prop({
    type: String,
    trim: true,
    enum: ENUM_PERMISSION_TYPE,
  })
  @IsEnum(ENUM_PERMISSION_TYPE)
  permissionEnumType: ENUM_PERMISSION_TYPE;

  @Prop({
    type: String,
    trim: true,
    enum: ENUM_PERMISSION_ACTION,
  })
  @IsEnum(ENUM_PERMISSION_ACTION)
  permissionEnumAction: ENUM_PERMISSION_ACTION;
}
export const PermissionSchema = SchemaFactory.createForClass(Permission);
export type PermissionDoc = Permission & Document;

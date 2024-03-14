import { Module } from '@nestjs/common';
import { RoleService } from './services/role.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './entities/role.entity';
import { PermissionModule } from '../permissions/permission.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    PermissionModule,
  ],
  controllers: [],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}

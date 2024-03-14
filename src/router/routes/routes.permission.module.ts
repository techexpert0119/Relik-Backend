import { Module } from '@nestjs/common';
import { PermissionController } from 'src/modules/permissions/controller/permission.controller';
import { PermissionModule } from 'src/modules/permissions/permission.module';

@Module({
  controllers: [PermissionController],
  providers: [],
  exports: [],
  imports: [PermissionModule],
})
export class RoutesPermissionModule {}

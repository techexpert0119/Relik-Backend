import { Module } from '@nestjs/common';
import { RoleController } from 'src/modules/role/controllers/role.controller';
import { RoleModule } from 'src/modules/role/role.module';

@Module({
  controllers: [RoleController],
  providers: [],
  exports: [],
  imports: [RoleModule],
})
export class RoutesRoleModule {}

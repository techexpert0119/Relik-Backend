import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { AuthModule } from 'src/common/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from 'src/modules/user/user.module';
import { RoleModule } from 'src/modules/role/role.module';

@Module({
  imports: [CommonModule, CommandModule, AuthModule, RoleModule, UserModule],
  providers: [],
  exports: [],
})
export class MigrationModule {}

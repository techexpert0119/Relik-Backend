import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/common/auth/auth.module';
import { MessagePublicController } from 'src/common/message/controllers/message.public.controller';
import { UserModule } from 'src/modules/user/user.module';
import { RoleModule } from 'src/modules/role/role.module';

@Module({
  controllers: [MessagePublicController],
  providers: [],
  exports: [],
  imports: [TerminusModule, UserModule, AuthModule, RoleModule],
})
export class RoutesPublicModule {}

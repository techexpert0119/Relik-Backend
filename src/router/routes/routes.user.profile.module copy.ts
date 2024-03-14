import { Module } from '@nestjs/common';
import { RoleModule } from 'src/modules/role/role.module';
import { UserModule } from 'src/modules/user/user.module';
import { SessionModule } from '../../modules/session/session.module';
import { UserProfileController } from 'src/modules/user/controllers/user.profile.controller';

@Module({
  imports: [UserModule, RoleModule, SessionModule],
  controllers: [UserProfileController],
  providers: [],
  exports: [],
})
export class RoutesUserProfileModule {}

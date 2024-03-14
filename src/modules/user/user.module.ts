import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './services/user.service';
import { AuthModule } from 'src/common/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { RoleModule } from '../role/role.module';
import { PageModule } from '../page/page.module';
import { PermissionModule } from '../permissions/permission.module';
import { GoogleStrategy } from 'src/common/auth/strategies/google.strategy';
import { FacebookStrategy } from 'src/common/auth/strategies/facebook.strategy';
import { SessionModule } from '../session/session.module';
import { Role, RoleSchema } from '../role/entities/role.entity';
import { TwitterStrategy } from 'src/common/auth/strategies/twitter.strategy';
import { AgencyModule } from '../agency/agency.module';
import { VerificationModule } from '../verification/verification.module';
import { ValidateEmailModule } from 'src/common/validate-email/validate-email.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    AuthModule,
    RoleModule,
    PageModule,
    PermissionModule,
    SessionModule,
    VerificationModule,
    ValidateEmailModule,
    forwardRef(() => AgencyModule),
  ],
  exports: [UserService],
  providers: [UserService, GoogleStrategy, FacebookStrategy, TwitterStrategy],
  controllers: [],
})
export class UserModule {}

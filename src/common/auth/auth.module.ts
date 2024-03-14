import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from './strategies';
import { SessionModule } from '../../modules/session/session.module';

@Module({
  imports: [JwtModule.register({}), SessionModule],
  providers: [AuthService, AtStrategy, RtStrategy],
  exports: [AuthService],
})
export class AuthModule {}

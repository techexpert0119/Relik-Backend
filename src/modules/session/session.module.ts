import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionModule } from '../permissions/permission.module';
import { Session, SessionSchema } from './entities/session.entity';
import { SessionService } from './services/session.service';

const servicesToExport = [SessionService];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    PermissionModule,
  ],
  controllers: [],
  providers: [...servicesToExport],
  exports: [...servicesToExport],
})
export class SessionModule {}

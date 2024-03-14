import { Module } from '@nestjs/common';
import { PermissionService } from './services/permission.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from './entities/permission.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  exports: [PermissionService],
  providers: [PermissionService],
  controllers: [],
})
export class PermissionModule {}

import { Module } from '@nestjs/common';
import { FileController } from 'src/modules/file/controller/file.controller';
import { FileModule } from 'src/modules/file/file.module';

@Module({
  controllers: [FileController],
  providers: [],
  exports: [],
  imports: [FileModule],
})
export class RoutesFileModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './entities/file.entity';
import { FileService } from './services/file.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  ],
  exports: [FileService],
  providers: [FileService],
  controllers: [],
})
export class FileModule {}

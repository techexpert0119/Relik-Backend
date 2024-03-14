import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../services/file.service';
import { ApiTags } from '@nestjs/swagger';
import { FileSizeValidatorPipe } from 'src/common/file/pipes/file.size.pipe';
import { GetCurrentUserId } from 'src/common/auth/decorators';

@ApiTags('File upload')
@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @GetCurrentUserId() userId: string,
    @UploadedFile(new FileSizeValidatorPipe(5 * 1024 * 1024))
    file: Express.Multer.File
  ) {
    return await this.fileService.uploadImage(
      file.originalname,
      file.buffer,
      file.mimetype,
      file.size,
      userId
    );
  }

  @Post('/file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @GetCurrentUserId() userId: string,
    @UploadedFile(new FileSizeValidatorPipe(10 * 1024 * 1024))
    file: Express.Multer.File
  ) {
    return await this.fileService.uploadFile(
      file.originalname,
      file.buffer,
      file.mimetype,
      file.size,
      userId
    );
  }
}

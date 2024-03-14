import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { GetCurrentUser } from 'src/common/auth/decorators';
import { UserTokenInfo } from 'src/common/auth/types/user-token-info.type';
import { PageVersionHistoryService } from '../services/page-version-history.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateOneDto } from '../dtos/update-one.dto';
import { CreateOneDto } from '../dtos/create-one.dto';

@ApiTags('Page version history')
@Controller()
export class PageVersionHistoryController {
  constructor(
    private readonly pageVersionHistoryService: PageVersionHistoryService
  ) {}

  @Get(':pageId')
  getAll(
    @Param('pageId') pageId: string,
    @GetCurrentUser() user: UserTokenInfo
  ) {
    return this.pageVersionHistoryService.getAll(pageId, user.sub);
  }

  @Patch(':id')
  updateOne(
    @Param('id') id: string,
    @GetCurrentUser() user: UserTokenInfo,
    @Body() updateOneDto: UpdateOneDto
  ) {
    return this.pageVersionHistoryService.updateOne(id, user.sub, updateOneDto);
  }

  @Post()
  createOne(
    @GetCurrentUser() user: UserTokenInfo,
    @Body() createOneDto: CreateOneDto
  ) {
    return this.pageVersionHistoryService.createOne(user.sub, createOneDto);
  }

  @Post('rollback/:id')
  rollback(@Param('id') id: string, @GetCurrentUser() user: UserTokenInfo) {
    return this.pageVersionHistoryService.rollback(id, user.sub);
  }
}

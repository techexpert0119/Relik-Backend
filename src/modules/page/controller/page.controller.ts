import { PageCreateDto } from '../dtos/page.create.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PageService } from '../services/page.service';
import { GetCurrentUser, Public } from 'src/common/auth/decorators';
import { UserTokenInfo } from 'src/common/auth/types/user-token-info.type';
import { ApiTags } from '@nestjs/swagger';
import { PageDraft } from '../entities/page.entity';
import { UpdateThemeDto } from '../dtos/update-theme.dto';
import { UpdatePageDto } from '../dtos/update-page.dto';
import { UpdatePageHeaderDto } from '../dtos/update-page-header.dto';
import { UpdatePageLinkDto } from '../dtos/update-page-link.dto';

@ApiTags('page')
@Controller()
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post()
  create(
    @GetCurrentUser() user: UserTokenInfo,
    @Body() pageCreateDto: PageCreateDto
  ) {
    return this.pageService.createPage(user, pageCreateDto);
  }

  @Get()
  findAll(@Query() queryParam, @GetCurrentUser() user: UserTokenInfo) {
    return this.pageService.findAllPagesOfUser(queryParam, user);
  }

  @Get(':id')
  getOne(@GetCurrentUser() user: UserTokenInfo, @Param('id') id: string) {
    return this.pageService.getOneWithFeatures(id, user.sub);
  }

  @Public()
  @Get('public/:pageLink')
  getPublicOneWithPublicFeatures(@Param('pageLink') pageLink: string) {
    return this.pageService.getPublicOneWithPublicFeatures(pageLink);
  }

  @Patch(':id')
  async updateOne(
    @GetCurrentUser() user: UserTokenInfo,
    @Param('id') id: string,
    @Body() body: UpdatePageDto
  ) {
    return this.pageService.updateOne(id, body, user.sub);
  }

  @Patch(':id/header')
  async updatePageHeader(
    @GetCurrentUser() user: UserTokenInfo,
    @Param('id') id: string,
    @Body() body: UpdatePageHeaderDto
  ) {
    return this.pageService.updatePageHeader(id, body, user.sub);
  }

  @Patch('/:id/link')
  async updatePageLink(
    @GetCurrentUser() user: UserTokenInfo,
    @Param('id') id: string,
    @Body() body: UpdatePageLinkDto
  ) {
    return this.pageService.updatePageLink(id, body, user.sub);
  }

  @Post(':id/deactivate')
  async deactivatePage(
    @GetCurrentUser() user: UserTokenInfo,
    @Param('id') id: string
  ) {
    return this.pageService.deactivatePage(id, user.sub);
  }

  @Patch('/theme/:id')
  async updatePageTheme(
    @GetCurrentUser() user: UserTokenInfo,
    @Param('id') id: string,
    @Body() body: UpdateThemeDto
  ): Promise<PageDraft> {
    return this.pageService.updateTheme(id, body, user.sub);
  }

  @Post('undo-operation/:id')
  undo(@Param('id') id: string, @GetCurrentUser() user: UserTokenInfo) {
    return this.pageService.undoOperation(id, user.sub);
  }

  @Post('redo-operation/:id')
  redo(@Param('id') id: string, @GetCurrentUser() user: UserTokenInfo) {
    return this.pageService.redoOperation(id, user.sub);
  }
}

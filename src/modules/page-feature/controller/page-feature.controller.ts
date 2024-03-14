import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { PageFeatureService } from '../services/page-feature.service';
import { PageFeatureCreateDto } from '../dtos/page-feature.create.dto';
import { GetCurrentUser, Public } from 'src/common/auth/decorators';
import { UserTokenInfo } from 'src/common/auth/types/user-token-info.type';
import { ReorderRequestDto } from '../dtos/reorder-request.dto';
import { CopyFeatureDto } from '../dtos/copy-feature.dto';
import { PageFeatureUpdateDto } from '../dtos/page-feature.update.dto';
import { PageFeatureDraftDoc } from '../entities/page-feature.entity';
import { ProcessContactFeatureDto } from '../dtos/process-feature/process-contact-feature.dto';

@Controller()
export class PageFeatureController {
  constructor(private readonly pageFeatureService: PageFeatureService) {}

  @Post()
  createOne(
    @GetCurrentUser() user: UserTokenInfo,
    @Body() feature: PageFeatureCreateDto
  ) {
    return this.pageFeatureService.createOne(feature, user);
  }

  @Patch()
  updateOne(
    @GetCurrentUser() user: UserTokenInfo,
    @Body() feature: PageFeatureUpdateDto
  ): Promise<PageFeatureDraftDoc> {
    return this.pageFeatureService.updateOne(feature, user);
  }

  @Patch('move')
  reorder(
    @GetCurrentUser() user: UserTokenInfo,
    @Body() body: ReorderRequestDto
  ) {
    return this.pageFeatureService.reorder(user, body);
  }

  @Post('copy')
  copy(@GetCurrentUser() user: UserTokenInfo, @Body() body: CopyFeatureDto) {
    return this.pageFeatureService.copy(user, body);
  }

  @Delete(':id')
  deleteOne(@GetCurrentUser() user: UserTokenInfo, @Param('id') id: string) {
    return this.pageFeatureService.deleteOne(user, id);
  }

  @Public()
  @Post('public/process/contact')
  async processContactFeature(
    @Body() processContactFeatureDto: ProcessContactFeatureDto
  ) {
    return await this.pageFeatureService.processContactFeature(
      processContactFeatureDto
    );
  }
}

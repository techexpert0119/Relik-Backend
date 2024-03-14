import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { PerformanceService } from '../services/performance.service';
import { GetCurrentUser } from 'src/common/auth/decorators';
import { UserTokenInfo } from 'src/common/auth/types/user-token-info.type';
import { PageService } from '../../page/services/page.service';
import { PageStatus } from '../../page/enums/page-status';
import { Page } from '../../page/entities/page.entity';

@ApiTags('performance')
@Controller()
export class PerformanceController {
  constructor(
    private readonly pageService: PageService,
    private readonly performanceService: PerformanceService
  ) {}

  private async getSelectedPages(
    user: UserTokenInfo,
    pageIds: string[]
  ): Promise<Page[]> {
    let selectedPages = [] as Page[];
    try {
      const pages = await this.pageService.findAllPagesOfUser(
        { status: PageStatus.ACTIVE },
        user
      );
      selectedPages = pages.data
        .map(
          (page: any) =>
            ({
              ...page._doc,
              mSiteId: page.mSiteId ?? '2',
            }) as Page & { _id: Types.ObjectId }
        )
        .filter(
          (page) => !pageIds?.length || pageIds.includes(page._id.toString())
        );
    } catch (err) {
      err.message = 'pageService.findAllPagesOfUser: ' + err.message;
      console.error(err);
    }

    return selectedPages;
  }

  @Get('overall')
  async getOverall(
    // TODO: Make sure the use has the right permissions
    @GetCurrentUser() user: UserTokenInfo,
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
    @Query('pages') pageIds: string[]
  ) {
    console.time('/performance/overall: getSelectedPages');
    let selectedPages: Page[];
    try {
      selectedPages = await this.getSelectedPages(user, pageIds);
    } catch (err) {
      err.message = 'this.getSelectedPages: ' + err.message;
      throw err;
    }
    console.timeEnd('/performance/overall: getSelectedPages');

    return this.performanceService.getPagesOverall({
      user,
      dateFrom,
      dateTo,
      mSiteIds: selectedPages.map((page) => page.mSiteId),
    });
  }

  @Get('top-pages')
  async getTopPages(
    // TODO: Make sure the use has the right permissions
    @GetCurrentUser() user: UserTokenInfo,
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
    @Query('pages') pageIds: string[],
    @Query('pageSize') pageSize: number,
    @Query('pageNumber') pageNumber: number
  ) {
    console.time('/performance/top-pages: getSelectedPages');
    let selectedPages: Page[];
    try {
      selectedPages = await this.getSelectedPages(user, pageIds);
    } catch (err) {
      err.message = 'this.getSelectedPages: ' + err.message;
      throw err;
    }
    console.timeEnd('/performance/top-pages: getSelectedPages');

    return this.performanceService.getTopPages({
      user,
      dateFrom,
      dateTo,
      pages: selectedPages,
      pageSize: isNaN(pageSize) ? 10 : pageSize,
      pageNumber: isNaN(pageNumber) ? 0 : pageNumber,
    });
  }

  @Get('views')
  async getViews(
    // TODO: Make sure the use has the right permissions
    @GetCurrentUser() user: UserTokenInfo,
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
    @Query('page') pageId: string
  ) {
    console.time('/performance/views: getSelectedPages');
    let selectedPages: Page[] = [];
    try {
      selectedPages = await this.getSelectedPages(user, [pageId]);
    } catch (err) {
      err.message = 'this.getSelectedPages: ' + err.message;
      throw err;
    }
    console.timeEnd('/performance/views: getSelectedPages');

    if (!selectedPages.length) {
      throw new Error('There is no selected page!');
    }

    return this.performanceService.getViews({
      user,
      dateFrom,
      dateTo,
      mSiteId: selectedPages[0].mSiteId,
    });
  }

  @Get('traffic-by-location')
  async getTrafficByLocation(
    // TODO: Make sure the use has the right permissions
    @GetCurrentUser() user: UserTokenInfo,
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
    @Query('pages') pageIds: string[]
  ) {
    console.time('/performance/traffic-by-location: getSelectedPages');
    let selectedPages: Page[];
    try {
      selectedPages = await this.getSelectedPages(user, pageIds);
    } catch (err) {
      err.message = 'this.getSelectedPages: ' + err.message;
      throw err;
    }
    console.timeEnd('/performance/traffic-by-location: getSelectedPages');

    return this.performanceService.getTrafficByLocation({
      user,
      dateFrom,
      dateTo,
      mSiteIds: selectedPages.map((page) => page.mSiteId),
    });
  }

  @Get('traffic-by-channel')
  async getTrafficByChannel(
    // TODO: Make sure the use has the right permissions
    @GetCurrentUser() user: UserTokenInfo,
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
    @Query('pages') pageIds: string[]
  ) {
    console.time('/performance/traffic-by-channel: getSelectedPages');
    let selectedPages: Page[];
    try {
      selectedPages = await this.getSelectedPages(user, pageIds);
    } catch (err) {
      err.message = 'this.getSelectedPages: ' + err.message;
      throw err;
    }
    console.timeEnd('/performance/traffic-by-channel: getSelectedPages');

    return this.performanceService.getTrafficByChannel({
      user,
      dateFrom,
      dateTo,
      mSiteIds: selectedPages.map((page) => page.mSiteId),
    });
  }

  @Get('traffic-by-device')
  async getTrafficByDevice(
    // TODO: Make sure the use has the right permissions
    @GetCurrentUser() user: UserTokenInfo,
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
    @Query('pages') pageIds: string[]
  ) {
    console.time('/performance/traffic-by-device: getSelectedPages');
    let selectedPages: Page[];
    try {
      selectedPages = await this.getSelectedPages(user, pageIds);
    } catch (err) {
      err.message = 'this.getSelectedPages: ' + err.message;
      throw err;
    }
    console.timeEnd('/performance/traffic-by-device: getSelectedPages');

    return this.performanceService.getTrafficByDevice({
      user,
      dateFrom,
      dateTo,
      mSiteIds: selectedPages.map((page) => page.mSiteId),
    });
  }

  @Get('top-links')
  async getTopLinks(
    // TODO: Make sure the use has the right permissions
    @GetCurrentUser() user: UserTokenInfo,
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
    @Query('pages') pageIds: string[]
  ) {
    console.time('/performance/top-links: getSelectedPages');
    let selectedPages: Page[];
    try {
      selectedPages = await this.getSelectedPages(user, pageIds);
    } catch (err) {
      err.message = 'this.getSelectedPages: ' + err.message;
      throw err;
    }
    console.timeEnd('/performance/top-links: getSelectedPages');

    return this.performanceService.getTopLinks({
      user,
      dateFrom,
      dateTo,
      mSiteIds: selectedPages.map((page) => page.mSiteId),
    });
  }
}

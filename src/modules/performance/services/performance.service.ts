import { forwardRef, Inject, Injectable } from '@nestjs/common';
import moment from 'moment';
import process from 'node:process';

import { UserTokenInfo } from 'src/common/auth/types/user-token-info.type';
import { UserService } from 'src/modules/user/services/user.service';
import {
  Matomo,
  OutlinksResponse,
  TrafficByChannelResponse,
  TrafficByDeviceResponse,
  TrafficByLocationResponse,
  VisitorsOverviewResponse,
} from '../../../lib/matomo';
import { Page } from '../../page/entities/page.entity';
import { KeyValue } from "../../../common/interfaces";

@Injectable()
export class PerformanceService {
  private readonly matomo: Matomo;

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {
    this.matomo = new Matomo({
      authToken: process.env.MATOMO_AUTH_TOKEN,
      matomoBaseUrl: process.env.MATOMO_BASE_URL,
    });
  }

  private static calculateGrowthRate(
    current: number,
    previous: number
  ): number {
    if (previous > 0) {
      return ((current - previous) / previous) * 100;
    } else if (current > 0) {
      return 100;
    } else {
      return 0;
    }
  }

  private static generateColorFromCountryCode(str: string): string {
    if (str.length !== 2) {
      throw new Error('Input string must be 2 characters long');
    }

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    // Convert the hash to a 6-digit hexadecimal color
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ('00' + value.toString(16)).substr(-2);
    }

    return color;
  }

  async getPagesOverall({
    dateFrom,
    dateTo,
    mSiteIds,
  }: {
    user: UserTokenInfo;
    dateFrom: string;
    dateTo: string;
    mSiteIds: string[];
  }) {
    const dateDiff = moment(dateTo).diff(moment(dateFrom), 'days');
    const prevDateFrom = moment(dateFrom)
      .subtract(dateDiff, 'days')
      .format('YYYY-MM-DD');
    const prevDateTo = moment(dateTo)
      .subtract(dateDiff, 'days')
      .format('YYYY-MM-DD');

    // TODO: Revisit this when it's supported
    // Referrers.getReferrerType with multiple sites is not supported (yet).
    // pageIds.join(','),

    let totalUniqueViewsCount = 0;
    let totalViewCount = 0;
    let totalPreviousViewCount = 0;
    let totalClickCount = 0;
    let totalPreviousClickCount = 0;

    console.time('/performance/overall: gather data');
    const getVisitorsOverviewPromises = [];
    for (const siteId of mSiteIds) {
      getVisitorsOverviewPromises.push(
        this.matomo.GetVisitorsOverview({
          siteId: siteId,
          period: 'range',
          dateFrom: prevDateFrom,
          dateTo: prevDateTo,
        }),
        this.matomo.GetVisitorsOverview({
          siteId: siteId,
          period: 'range',
          dateFrom,
          dateTo,
        })
      );
    }

    const results = await Promise.all(getVisitorsOverviewPromises);
    for (let i = 0; i < results.length; i += 2) {
      const prevRange = results[i] as VisitorsOverviewResponse;
      const currentRange = results[i + 1] as VisitorsOverviewResponse;
      const prevRangeSiteId = Object.keys(prevRange)[0];
      const currentRangeSiteId = Object.keys(currentRange)[0];

      totalUniqueViewsCount +=
        currentRange[currentRangeSiteId].nb_uniq_pageviews;
      totalViewCount += currentRange[currentRangeSiteId].nb_pageviews;
      totalPreviousViewCount += prevRange[prevRangeSiteId].nb_pageviews;
      totalClickCount += currentRange[currentRangeSiteId].nb_outlinks;
      totalPreviousClickCount += prevRange[prevRangeSiteId].nb_outlinks;
    }
    console.timeEnd('/performance/overall: gather data');

    const viewGrowthRate = PerformanceService.calculateGrowthRate(
      totalViewCount,
      totalPreviousViewCount
    );
    const clickGrowthRate = PerformanceService.calculateGrowthRate(
      totalClickCount,
      totalPreviousClickCount
    );

    const previousCTR =
      totalPreviousViewCount > 0
        ? (totalPreviousClickCount / totalPreviousViewCount) * 100
        : 0;
    const CTR =
      totalViewCount > 0 ? (totalClickCount / totalViewCount) * 100 : 0;
    const CTRGrowthRate = PerformanceService.calculateGrowthRate(
      CTR,
      previousCTR
    );

    return {
      uniqueViewsCount: totalUniqueViewsCount,
      viewCount: totalViewCount,
      viewGrowthRate,
      clickCount: totalClickCount,
      clickGrowthRate,
      CTR,
      CTRGrowthRate,
    };
  }

  async getViews({
    dateFrom,
    dateTo,
    mSiteId,
  }: {
    user: UserTokenInfo;
    dateFrom: string;
    dateTo: string;
    mSiteId: string;
  }) {
    console.time('/performance/views: gather data')
    let result: VisitorsOverviewResponse;
    try {
      result = await this.matomo.GetVisitorsOverview({
        siteId: mSiteId,
        period: 'day',
        dateFrom,
        dateTo,
      });
    } catch (err) {
      err.message = 'matomo.GetVisitorsOverview: ' + err.message;
      throw err;
    }
    console.timeEnd('/performance/views: gather data')

    const views = Object.keys(result[mSiteId]).map((key) => ({
      date: moment(key).format('MMM DD, YYYY'),
      value: result[mSiteId][key].nb_uniq_visitors ?? 0,
    }));

    return { views };
  }

  async getTopPages({
    dateFrom,
    dateTo,
    pages,
    pageSize,
    pageNumber,
  }: {
    user: UserTokenInfo;
    dateFrom: string;
    dateTo: string;
    pages: Page[];
    pageSize: number;
    pageNumber: number;
  }) {
    // console.time('/performance/top-pages: gather data')
    // const pagesPerformance = [] as any[];
    // for (const page of pages) {
    //   let result: VisitorsOverviewResponse;
    //   try {
    //     result = await this.matomo.GetVisitorsOverview({
    //       siteId: page.mSiteId,
    //       period: 'range',
    //       dateFrom,
    //       dateTo,
    //     });
    //   } catch (err) {
    //     err.message = 'matomo.GetVisitorsOverview: ' + err.message;
    //     throw err;
    //   }
    //   // console.debug('matomo.GetVisitorsOverview', result);
    //
    //   pagesPerformance.push({
    //     pageName: page.pageName,
    //     pageLink: page.pageLink,
    //     imageUrl: (page?.pageProfilePhoto as any)?.url,
    //     viewCount: result[page.mSiteId].nb_pageviews,
    //     clickCount: result[page.mSiteId].nb_outlinks,
    //     CTR:
    //       result[page.mSiteId].nb_pageviews > 0
    //         ? (result[page.mSiteId].nb_outlinks /
    //             result[page.mSiteId].nb_pageviews) *
    //           100
    //         : 0,
    //   });
    // }
    // console.timeEnd('/performance/top-pages: gather data')
    console.time('/performance/top-pages: gather data');
    const getVisitorsOverviewPromises = [];
    for (const page of pages) {
      getVisitorsOverviewPromises.push(
        this.matomo.GetVisitorsOverview({
          siteId: page.mSiteId,
          period: 'range',
          dateFrom: dateFrom,
          dateTo: dateTo,
        })
      );
    }
    const pagesPerformance = [] as any[];
    const results = await Promise.all(getVisitorsOverviewPromises);
    for (let i = 0; i < results.length; i++) {
      const page = pages[i];
      const result = results[i] as VisitorsOverviewResponse;

      pagesPerformance.push({
        pageName: page.pageName,
        pageLink: page.pageLink,
        imageUrl: (page?.pageProfilePhoto as any)?.url,
        viewCount: result[page.mSiteId].nb_pageviews,
        clickCount: result[page.mSiteId].nb_outlinks,
        CTR:
          result[page.mSiteId].nb_pageviews > 0
            ? (result[page.mSiteId].nb_outlinks /
                result[page.mSiteId].nb_pageviews) *
              100
            : 0,
      });
    }
    console.timeEnd('/performance/top-pages: gather data');

    pagesPerformance.sort((a, b) => b.viewCount - a.viewCount);

    return {
      pages: pagesPerformance.slice(
        pageNumber * pageSize,
        (pageNumber + 1) * pageSize
      ),
    };
  }

  async getTrafficByLocation({
    dateFrom,
    dateTo,
    mSiteIds,
  }: {
    user: UserTokenInfo;
    dateFrom: string;
    dateTo: string;
    mSiteIds: string[];
  }) {
    console.time('/performance/traffic-by-location: gather data');
    let result: TrafficByLocationResponse;
    try {
      result = await this.matomo.GetTrafficByLocation({
        siteId: mSiteIds.join(','),
        period: 'range',
        dateFrom,
        dateTo,
      });
    } catch (err) {
      err.message = 'matomo.GetTrafficByLocation: ' + err.message;
      throw err;
    }
    console.timeEnd('/performance/traffic-by-location: gather data');

    const countries: {
      color: string;
      code: string;
      name: string;
      value: number;
    }[] = Object.values(
      Object.values(result).reduce((acc, cur) => {
        for (const entry of cur) {
          if (!acc[entry.code]) {
            acc[entry.code] = {
              color: PerformanceService.generateColorFromCountryCode(
                entry.code
              ),
              code: entry.code,
              name: entry.label,
              value: 0,
            };
          }
          acc[entry.code].value += entry.nb_visits;
        }
        return acc;
      }, {})
    );
    const totalVisits = countries.reduce((acc, cur) => acc + cur.value, 0);

    return {
      countries: countries.map((country) => ({
        ...country,
        value: (country.value / totalVisits) * 100,
      })),
    };
  }

  async getTrafficByChannel({
    dateFrom,
    dateTo,
    mSiteIds,
  }: {
    user: UserTokenInfo;
    dateFrom: string;
    dateTo: string;
    mSiteIds: string[];
  }) {
    // TODO: Revisit this when it's supported
    // Referrers.getReferrerType with multiple sites is not supported (yet).
    // pageIds.join(','),

    // console.time('/performance/traffic-by-channel: gather data');
    // let channelsMap: { [key: string]: { name: string; value: number } } = {};
    // for (const pageId of mSiteIds) {
    //   let result: TrafficByChannelResponse;
    //   try {
    //     result = await this.matomo.GetTrafficByChannel({
    //       siteId: pageId,
    //       period: 'range',
    //       dateFrom,
    //       dateTo,
    //     });
    //   } catch (err) {
    //     err.message = 'matomo.GetTrafficByChannel: ' + err.message;
    //     throw err;
    //   }
    //   // console.debug('matomo.GetTrafficByChannel', result);
    //
    //   channelsMap = result[pageId].reduce((acc, cur) => {
    //     if (!acc[cur.label]) {
    //       acc[cur.label] = {
    //         name: cur.label,
    //         value: 0,
    //       };
    //     }
    //     acc[cur.label].value += cur.nb_visits;
    //     return acc;
    //   }, channelsMap);
    // }
    // console.timeEnd('/performance/traffic-by-channel: gather data');

    console.time('/performance/traffic-by-channel: gather data');
    const getTrafficByChannelPromises = [];
    for (const pageId of mSiteIds) {
      getTrafficByChannelPromises.push(
        this.matomo.GetTrafficByChannel({
          siteId: pageId,
          period: 'range',
          dateFrom,
          dateTo,
        })
      );
    }
    const results = await Promise.all(getTrafficByChannelPromises);
    let channelsMap: Record<string, KeyValue<number>> = {};
    for (let i = 0; i < results.length; i++) {
      const pageId = mSiteIds[i];
      const result = results[i] as TrafficByChannelResponse;
      channelsMap = result[pageId].reduce((acc, cur) => {
        if (!acc[cur.label]) {
          acc[cur.label] = {
            key: cur.label,
            value: 0,
          };
        }
        acc[cur.label].value += cur.nb_visits;
        return acc;
      }, channelsMap);
    }
    console.timeEnd('/performance/traffic-by-channel: gather data');

    const channels = Object.values(channelsMap);
    const totalVisits = channels.reduce((acc, cur) => acc + cur.value, 0);

    return {
      channels: channels.map((channel) => ({
        ...channel,
        value: (channel.value / totalVisits) * 100,
      })),
    };
  }

  async getTrafficByDevice({
    dateFrom,
    dateTo,
    mSiteIds,
  }: {
    user: UserTokenInfo;
    dateFrom: string;
    dateTo: string;
    mSiteIds: string[];
  }) {
    console.time('/performance/traffic-by-device: gather data');
    let result: TrafficByDeviceResponse;
    try {
      result = await this.matomo.GetTrafficByDevice({
        siteId: mSiteIds.join(','),
        period: 'range',
        dateFrom,
        dateTo,
      });
    } catch (err) {
      err.message = 'matomo.GetTrafficByDevice: ' + err.message;
      throw err;
    }
    console.timeEnd('/performance/traffic-by-device: gather data');

    const devices = Object.values(
      Object.values(result).reduce((acc, cur) => {
        for (const entry of cur) {
          if (!acc[entry.label]) {
            acc[entry.label] = {
              key: entry.label,
              value: 0,
            };
          }
          acc[entry.label].value += entry.nb_visits;
        }
        return acc;
      }, {})
    ).filter((device: KeyValue<number>) => device.value) as KeyValue<number>[];

    const totalVisits = devices.reduce((acc, cur) => acc + cur.value, 0);

    return {
      devices: devices.map((device: KeyValue<number>) => ({
        ...device,
        value: (device.value / totalVisits) * 100,
      })),
    };
  }

  async getTopLinks({
    dateFrom,
    dateTo,
    mSiteIds,
  }: {
    user: UserTokenInfo;
    dateFrom: string;
    dateTo: string;
    mSiteIds: string[];
  }) {
    console.time('/performance/top-links: gather data');
    let result: OutlinksResponse;
    try {
      result = await this.matomo.GetOutlinks({
        siteId: mSiteIds.join(','),
        period: 'range',
        dateFrom,
        dateTo,
      });
    } catch (err) {
      err.message = 'matomo.GetOutlinks: ' + err.message;
      throw err;
    }
    console.timeEnd('/performance/top-links: gather data');

    const outlinks = (
      Object.values(
        Object.values(result).reduce((acc, cur) => {
          for (const entry of cur) {
            if (!acc[entry.label]) {
              acc[entry.label] = {
                key: entry.label,
                value: 0,
              };
            }
            acc[entry.label].value += entry.nb_visits;
          }
          return acc;
        }, {})
      ) as KeyValue<number>[]
    ).sort((a, b) => b.value - a.value);

    return {
      outlinks,
    };
  }
}

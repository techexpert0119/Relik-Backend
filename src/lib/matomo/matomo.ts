import moment from 'moment';
import {
  BasicGetParams,
  CreateSiteParams,
  CreateSiteResponse,
  MatomoConfig,
  OutlinksResponse,
  TrafficByChannelResponse,
  TrafficByDeviceResponse,
  TrafficByLocationResponse,
  VisitorsLogResponse,
  VisitorsOverviewResponse,
} from './';

export class Matomo {
  authToken: string;
  matomoBaseUrl: string;

  private readonly baseUrlParams: { [key: string]: string };

  constructor(config: MatomoConfig) {
    this.authToken = config.authToken;
    this.matomoBaseUrl = config.matomoBaseUrl;

    this.baseUrlParams = {
      format: 'JSON',
      token_auth: this.authToken,
    };
  }

  private async makeApiCall(params: { [key: string]: string }) {
    const urlParams = new URLSearchParams({
      ...this.baseUrlParams,
      ...params,
    });
    const url = `${this.matomoBaseUrl}?${urlParams.toString()}`;

    let res: any;
    try {
      res = await fetch(url);
    } catch (err) {
      err.message = `Failed to fetch data from Matomo: ${err.message}`;
      throw err;
    }

    let data: any;
    try {
      data = await res.json();
    } catch (err) {
      err.message = `Failed to parse Matomo response: ${err.message}`;
      throw err;
    }

    return data;
  }

  private convertToMap<T>(siteId: string, data: T): T {
    return (
      siteId.includes(',')
        ? data
        : {
            [siteId]: data,
          }
    ) as T;
  }

  async CreateSite(params: CreateSiteParams): Promise<CreateSiteResponse> {
    return await this.makeApiCall({
      ...params,
      module: 'API',
      method: 'SitesManager.addSite',
    });
  }

  async GetVisitorsOverview(
    params: BasicGetParams
  ): Promise<VisitorsOverviewResponse> {
    let res: VisitorsOverviewResponse;
    try {
      res = await this.makeApiCall({
        module: 'API',
        method: 'API.get',
        period: params.period,
        date: `${params.dateFrom},${params.dateTo}`,
        idSite: params.siteId,
        filter_limit: '-1',
        random: moment().format('YYYYMMDDHHmm'),
      });
    } catch (err) {
      throw err;
    }

    return this.convertToMap<VisitorsOverviewResponse>(params.siteId, res);
  }

  async GetVisitorsLog(params: BasicGetParams): Promise<VisitorsLogResponse> {
    let res: VisitorsLogResponse;
    try {
      res = await this.makeApiCall({
        module: 'API',
        method: 'Live.getLastVisitsDetails',
        period: params.period,
        date: `${params.dateFrom},${params.dateTo}`,
        idSite: params.siteId,
        filter_limit: '-1',
        random: moment().format('YYYYMMDDHHmm'),
      });
    } catch (err) {
      throw err;
    }

    return this.convertToMap<VisitorsLogResponse>(params.siteId, res);
  }

  async GetTrafficByLocation(
    params: BasicGetParams
  ): Promise<TrafficByLocationResponse> {
    let res: TrafficByLocationResponse
    try {
      res = await this.makeApiCall({
        module: 'API',
        method: 'UserCountry.getCountry',
        period: params.period,
        date: `${params.dateFrom},${params.dateTo}`,
        idSite: params.siteId,
        filter_limit: '-1',
        random: moment().format('YYYYMMDDHHmm'),
      });
    } catch (err) {
      throw err;
    }

    return this.convertToMap<TrafficByLocationResponse>(params.siteId, res);
  }

  async GetTrafficByDevice(
    params: BasicGetParams
  ): Promise<TrafficByDeviceResponse> {
    let res: TrafficByDeviceResponse;
    try {
      res = await this.makeApiCall({
        module: 'API',
        method: 'DevicesDetection.getType',
        period: params.period,
        date: `${params.dateFrom},${params.dateTo}`,
        idSite: params.siteId,
        filter_limit: '-1',
        random: moment().format('YYYYMMDDHHmm'),
      });
    } catch (err) {
      throw err;
    }

    return this.convertToMap<TrafficByDeviceResponse>(params.siteId, res);
  }

  async GetTrafficByChannel(
    params: BasicGetParams
  ): Promise<TrafficByChannelResponse> {
    let res: TrafficByChannelResponse;
    try {
      res = await this.makeApiCall({
        module: 'API',
        method: 'Referrers.getReferrerType',
        period: params.period,
        date: `${params.dateFrom},${params.dateTo}`,
        idSite: params.siteId,
        filter_limit: '-1',
        random: moment().format('YYYYMMDDHHmm'),
      });
    } catch (err) {
      throw err;
    }

    return this.convertToMap<TrafficByChannelResponse>(params.siteId, res);
  }

  async GetOutlinks(params: BasicGetParams): Promise<OutlinksResponse> {
    let res: OutlinksResponse;
    try {
      res = await this.makeApiCall({
        module: 'API',
        method: 'Actions.getOutlinks',
        period: params.period,
        date: `${params.dateFrom},${params.dateTo}`,
        idSite: params.siteId,
        filter_limit: '-1',
        expanded: '1',
        random: moment().format('YYYYMMDDHHmm'),
      });
    } catch (err) {
      throw err;
    }

    return this.convertToMap<OutlinksResponse>(params.siteId, res);
  }
}

export interface MatomoConfig {
  authToken: string;
  matomoBaseUrl: string;
}

/**
 * BasicGetParams
 * @param siteId - The ID of the website
 * @param period - The period to get the report for. Valid values: day, week, month, year, range
 * @param dateFrom - The start date of the period e.g. 2024-01-13
 * @param dateTo - The end date of the period e.g. 2024-02-13
 */
export interface BasicGetParams {
  siteId: string;
  period: string;
  dateFrom: string;
  dateTo: string;
}

/**
 * CreateSiteParams
 * @param timezone - The timezone of the website e.g. Europe/Athens, Asia/Dubai
 * @param currency - The currency of the website e.g. EUR, USD, AED
 */
export interface CreateSiteParams {
  siteName: string;
  urls?: string;
  timezone?: string;
  currency?: string;
  ecommerce?: string;
  siteSearch?: string;
  searchKeywordParameters?: string;
  searchCategoryParameters?: string;
  excludedIps?: string;
  excludedQueryParameters?: string;
  group?: string;
  startDate?: string;
  excludedUserAgents?: string;
  keepURLFragments?: string;
  type?: string;
  settingValues?: string;
  excludeUnknownUrls?: string;
  excludedReferrers?: string;
}

export type CreateSiteResponse = {
  value: number;
};

export type VisitorsOverview = {
  nb_visits: number;
  nb_actions: number;
  max_actions: number;
  bounce_count: number;
  sum_visit_length: number;
  nb_visits_new: number;
  nb_actions_new: number;
  max_actions_new: number;
  bounce_rate_new: string;
  nb_actions_per_visit_new: number;
  avg_time_on_site_new: number;
  nb_visits_returning: number;
  nb_actions_returning: number;
  max_actions_returning: number;
  bounce_rate_returning: string;
  nb_actions_per_visit_returning: number;
  avg_time_on_site_returning: number;
  Referrers_visitorsFromSearchEngines: number;
  Referrers_visitorsFromSocialNetworks: number;
  Referrers_visitorsFromDirectEntry: number;
  Referrers_visitorsFromWebsites: number;
  Referrers_visitorsFromCampaigns: number;
  Referrers_distinctSearchEngines: number;
  Referrers_distinctSocialNetworks: number;
  Referrers_distinctKeywords: number;
  Referrers_distinctWebsites: number;
  Referrers_distinctWebsitesUrls: number;
  Referrers_distinctCampaigns: number;
  PagePerformance_network_time: number;
  PagePerformance_network_hits: number;
  PagePerformance_servery_time: number;
  PagePerformance_server_hits: number;
  PagePerformance_transfer_time: number;
  PagePerformance_transfer_hits: number;
  PagePerformance_domprocessing_time: number;
  PagePerformance_domprocessing_hits: number;
  PagePerformance_domcompletion_time: number;
  PagePerformance_domcompletion_hits: number;
  PagePerformance_onload_time: number;
  PagePerformance_onload_hits: number;
  PagePerformance_pageload_time: number;
  PagePerformance_pageload_hits: number;
  avg_time_network: number;
  avg_time_server: number;
  avg_time_transfer: number;
  avg_time_dom_processing: number;
  avg_time_dom_completion: number;
  avg_time_on_load: number;
  avg_page_load_time: number;
  nb_conversions: number;
  nb_visits_converted: number;
  revenue: number;
  conversion_rate: string;
  nb_conversions_new_visit: number;
  nb_visits_converted_new_visit: number;
  revenue_new_visit: number;
  conversion_rate_new_visit: string;
  nb_conversions_returning_visit: number;
  nb_visits_converted_returning_visit: number;
  revenue_returning_visit: number;
  conversion_rate_returning_visit: string;
  nb_pageviews: number;
  nb_uniq_pageviews: number;
  nb_downloads: number;
  nb_uniq_downloads: number;
  nb_outlinks: number;
  nb_uniq_outlinks: number;
  nb_searches: number;
  nb_keywords: number;
  Referrers_visitorsFromDirectEntry_percent: string;
  Referrers_visitorsFromSearchEngines_percent: string;
  Referrers_visitorsFromCampaigns_percent: string;
  Referrers_visitorsFromSocialNetworks_percent: string;
  Referrers_visitorsFromWebsites_percent: string;
  bounce_rate: string;
  nb_actions_per_visit: number;
  avg_time_on_site: number;
};

export type VisitorsOverviewResponse = Record<string, VisitorsOverview>;

export type VisitorsLog = Array<{
  idSite: number;
  idVisit: number;
  visitIp: string;
  visitorId: string;
  fingerprint: string;
  actionDetails: Array<{
    type: string;
    url: string;
    pageTitle?: string;
    pageIdAction: number;
    idpageview: string;
    serverTimePretty: string;
    pageId: number;
    timeSpent?: number;
    timeSpentPretty?: string;
    pageviewPosition: number;
    title?: string;
    subtitle: string;
    icon: string;
    iconSVG: string;
    timestamp: number;
    pageLoadTime?: string;
    pageLoadTimeMilliseconds?: number;
  }>;
  goalConversions: number;
  siteCurrency: string;
  siteCurrencySymbol: string;
  serverDate: string;
  visitServerHour: string;
  lastActionTimestamp: number;
  lastActionDateTime: string;
  siteName: string;
  serverTimestamp: number;
  firstActionTimestamp: number;
  serverTimePretty: string;
  serverDatePretty: string;
  serverDatePrettyFirstAction: string;
  serverTimePrettyFirstAction: string;
  userId: any;
  visitorType: string;
  visitorTypeIcon?: string;
  visitConverted: number;
  visitConvertedIcon: any;
  visitCount: number;
  visitEcommerceStatus: string;
  visitEcommerceStatusIcon: any;
  daysSinceFirstVisit: number;
  secondsSinceFirstVisit: number;
  daysSinceLastEcommerceOrder: number;
  secondsSinceLastEcommerceOrder: any;
  visitDuration: number;
  visitDurationPretty: string;
  searches: number;
  actions: number;
  interactions: number;
  referrerType: string;
  referrerTypeName: string;
  referrerName: string;
  referrerKeyword: string;
  referrerKeywordPosition: any;
  referrerUrl?: string;
  referrerSearchEngineUrl: any;
  referrerSearchEngineIcon: any;
  referrerSocialNetworkUrl?: string;
  referrerSocialNetworkIcon?: string;
  languageCode: string;
  language: string;
  deviceType: string;
  deviceTypeIcon: string;
  deviceBrand: string;
  deviceModel: string;
  operatingSystem: string;
  operatingSystemName: string;
  operatingSystemIcon: string;
  operatingSystemCode: string;
  operatingSystemVersion: string;
  browserFamily: string;
  browserFamilyDescription: string;
  browser: string;
  browserName: string;
  browserIcon: string;
  browserCode: string;
  browserVersion: string;
  events: number;
  continent: string;
  continentCode: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  region: string;
  regionCode: string;
  city: string;
  location: string;
  latitude: string;
  longitude: string;
  visitLocalTime: string;
  visitLocalHour: string;
  daysSinceLastVisit: number;
  secondsSinceLastVisit: number;
  resolution: string;
  plugins: string;
  pluginsIcons: Array<{
    pluginIcon: string;
    pluginName: string;
  }>;
}>;

export type VisitorsLogResponse = Record<string, VisitorsLog>;

export type TrafficByLocation = Array<{
  label: string;
  nb_visits: number;
  nb_actions: number;
  max_actions: number;
  sum_visit_length: number;
  bounce_count: number;
  nb_visits_converted: number;
  sum_daily_nb_uniq_visitors: number;
  sum_daily_nb_users: number;
  code: string;
  logo: string;
  segment: string;
  logoHeight: number;
}>;

export type TrafficByLocationResponse = Record<string, TrafficByLocation>;

export type TrafficByDevice = Array<{
  label: string;
  nb_visits: number;
  nb_actions: number;
  max_actions: number;
  sum_visit_length: number;
  bounce_count: number;
  nb_visits_converted: number;
  sum_daily_nb_uniq_visitors: number;
  sum_daily_nb_users: number;
  segment: string;
  logo: string;
}>;

export type TrafficByDeviceResponse = Record<string, TrafficByDevice>;

export type TrafficByChannel = Array<{
  label: string;
  nb_visits: number;
  nb_actions: number;
  max_actions: number;
  sum_visit_length: number;
  bounce_count: number;
  nb_visits_converted: number;
  sum_daily_nb_uniq_visitors: number;
  sum_daily_nb_users: number;
  segment: string;
  referrer_type: number;
  idsubdatatable?: number;
  subtable?: Array<{
    label: string;
    nb_visits: number;
    nb_actions: number;
    max_actions: number;
    sum_visit_length: number;
    bounce_count: number;
    nb_visits_converted: number;
    sum_daily_nb_uniq_visitors: number;
    sum_daily_nb_users: number;
    segment: string;
    url?: string;
    logo?: string;
  }>;
}>;

export type TrafficByChannelResponse = Record<string, TrafficByChannel>;

export type Outlinks = Array<{
  label: string;
  nb_visits: number;
  nb_hits: number;
  sum_time_spent: number;
  idsubdatatable: number;
  subtable: Array<{
    label: string;
    nb_visits: number;
    nb_hits: number;
    sum_time_spent: number;
    sum_daily_nb_uniq_visitors: number;
    url: string;
    segment: string;
  }>;
}>;

export type OutlinksResponse = Record<string, Outlinks>;

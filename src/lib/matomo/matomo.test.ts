import 'dotenv/config';
import { BasicGetParams, Matomo } from './';

describe('Matomo', () => {
  const matomo = new Matomo({
    matomoBaseUrl: process.env.MATOMO_BASE_URL,
    authToken: process.env.MATOMO_AUTH_TOKEN,
  });

  beforeEach(() => {});

  afterEach(() => {});

  it('should get the overall stats for site 51', async () => {
    const params: BasicGetParams = {
      siteId: '51',
      period: 'range',
      dateFrom: '2024-01-19',
      dateTo: '2024-02-19',
    };

    const res = await matomo.GetVisitorsOverview(params);
    expect(res).toHaveProperty('51');
    expect(res['51']).toHaveProperty('nb_visits');
    expect(res['51']['nb_visits']).toEqual(7);
  });

  it('should get the daily stats for site 51', async () => {
    const params: BasicGetParams = {
      siteId: '51',
      period: 'day',
      dateFrom: '2024-02-15',
      dateTo: '2024-02-19',
    };

    const res = await matomo.GetVisitorsOverview(params);
    expect(res).toHaveProperty('51');
    expect(res['51']).toHaveProperty('2024-02-15');
    expect(res['51']).toHaveProperty('2024-02-19');
    for (const key of Object.keys(res['51'])) {
      if (!res['51'][key].length) {
        continue
      }
      expect(res['51'][key]).toHaveProperty('nb_pageviews');
    }
    expect(res['51']['2024-02-16']['nb_pageviews']).toEqual(15)
  });

  it('should get outlinks for site 2', async () => {
    const params: BasicGetParams = {
      siteId: '2',
      period: 'range',
      dateFrom: '2024-01-19',
      dateTo: '2024-02-19',
    };

    const res = await matomo.GetOutlinks(params);
    expect(res).toHaveProperty('2');
    expect(res['2']).toHaveLength(4);
    expect(res['2'][0]).toHaveProperty('label');
  });

  it('should get outlinks for sites 2,51', async () => {
    const params: BasicGetParams = {
      siteId: '2,51',
      period: 'range',
      dateFrom: '2024-01-19',
      dateTo: '2024-02-19',
    };

    const res = await matomo.GetOutlinks(params);
    expect(res).toHaveProperty('2');
    expect(res['2']).toHaveLength(4);
    expect(res['2'][0]).toHaveProperty('label');
    expect(res).toHaveProperty('51');
    expect(res['51']).toHaveLength(1);
    expect(res['51'][0]).toHaveProperty('label');
  });
});

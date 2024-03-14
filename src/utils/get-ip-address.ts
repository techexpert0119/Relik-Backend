import * as requestIp from 'request-ip';
import { Request } from 'express';

export function getIPAddress(request: Request) {
  if (request?.clientIp) return request.clientIp;
  return requestIp.getClientIp(request);
}

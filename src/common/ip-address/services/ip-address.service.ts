import { Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IPAddressInformationDto } from '../dtos/ip-address-information.dto';
import { REQUEST } from '@nestjs/core';
import { getIPAddress } from 'src/utils/get-ip-address';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class IPAddressService {
  private readonly ipLookupKey: string;
  private readonly ipLookupURL: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(REQUEST) private readonly request: Request
  ) {
    this.ipLookupKey = this.configService.get<string>('ip.lookupKey');
    this.ipLookupURL = this.configService.get<string>('ip.lookupURL');
  }

  async getIPAddressInformation(): Promise<
    IPAddressInformationDto | undefined
  > {
    const ipAddress = getIPAddress(this.request);

    if (!ipAddress) return undefined;
    if (ipAddress === '::1') return undefined;

    const url = new URL(`${this.ipLookupURL}/${ipAddress}`);
    url.searchParams.set('key', this.ipLookupKey);

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch {
      return undefined;
    }
  }
}

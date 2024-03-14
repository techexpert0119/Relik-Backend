import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Session, SessionDoc } from '../entities/session.entity';
import { Scope } from '@nestjs/common/interfaces';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ISessionDto } from '../../page/dtos/session.dto';
import { UserTokenInfo } from '../../../common/auth/types/user-token-info.type';
import { UAParser } from 'ua-parser-js';
import { getIPAddress } from 'src/utils/get-ip-address';

@Injectable({ scope: Scope.REQUEST })
export class SessionService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<Session>,
    @Inject(REQUEST) private readonly request: Request
  ) {}

  public async saveSession(userId: Types.ObjectId): Promise<SessionDoc> {
    const parsedUserAgent = new UAParser(
      this.request.headers['user-agent']
    ).getResult();
    const userAgent =
      parsedUserAgent?.os?.name && parsedUserAgent?.browser?.name
        ? `${parsedUserAgent.os.name ?? 'unknown'}, ${
            parsedUserAgent.browser.name
          } browser`
        : 'Unknown';
    const ip = getIPAddress(this.request);

    const existingSession = await this.sessionModel.findOne({
      userId,
      ip,
      userAgent,
    });

    if (existingSession) return existingSession;

    return new this.sessionModel({
      userId,
      ip,
      userAgent,
      lastAccessTime: new Date(),
    }).save();
  }

  async getAllByUserId(id: string, sessionId: string): Promise<ISessionDto[]> {
    const sessionsDocs = await this.sessionModel
      .find({ userId: new Types.ObjectId(id) })
      .exec();
    const sessions = sessionsDocs.map((s) =>
      s.toObject({ getters: true })
    ) satisfies ISessionDto[];
    const currentSession = sessions.find((s) => s.id === sessionId);

    // For front end to show in list current session
    sessions.forEach((s) => (s.thisDevice = currentSession?.id === s.id));

    return sessions;
  }

  async removeById(userId: string, id: string) {
    const res = await this.sessionModel
      .deleteOne({
        userId: new Types.ObjectId(userId),
        _id: new Types.ObjectId(id),
      })
      .exec();

    return res;
  }

  async findById(sessionId: string): Promise<SessionDoc> {
    return this.sessionModel.findById(sessionId);
  }

  async removeAllExceptCurrent(user: UserTokenInfo) {
    return this.sessionModel.deleteMany({
      userId: new Types.ObjectId(user.sub),
      _id: { $ne: user.sessionId },
    });
  }

  async getExistingOne(params: Record<string, any>) {
    return this.sessionModel.findOne(params);
  }
}

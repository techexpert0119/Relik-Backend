import { SessionDoc } from '../../session/entities/session.entity';

export interface ISessionDto extends SessionDoc {
  thisDevice: boolean;
}

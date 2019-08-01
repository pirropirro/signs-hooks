import * as url from 'url';
import { Socket } from 'socket.io';
import { injectable, inject } from 'inversify';

import { IRoomExtractor } from './IRoomExtractor';
import { ISocketConfig } from '../socket/ISocket';

@injectable()
export class RoomExtractor implements IRoomExtractor {
  constructor(@inject("ISocketConfig") private config: ISocketConfig) { }

  extractFrom(socket: Socket): string {
    return (url.parse(socket.handshake.url, true).query.ns as string).replace(this.config.prefix, '');
  }
}
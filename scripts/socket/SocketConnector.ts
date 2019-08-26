import { ILogger } from 'signs-js';
import { Socket } from 'socket.io';

import { injectable, inject } from 'inversify';
import { IRoomExtractor } from '../room/IRoomExtractor';
import { IRoomRetriever } from '../room/IRoomRetriever';
import { ISocketConnector, IMessageEmitter } from './ISocket';

@injectable()
export class SocketConnector implements ISocketConnector {
  constructor(@inject("ILogger") private logger: ILogger,
    @inject("IMessageEmitter") private emitter: IMessageEmitter,
    @inject("IRoomRetriever") private rooms: IRoomRetriever,
    @inject("IRoomExtractor") private extractor: IRoomExtractor) {
    this.logger.setContext('SocketConnector');
  }

  connect(socket: Socket): void {
    const clientId = socket.client.id;
    const roomId = this.extractor.extractFrom(socket);
    const { room, params } = this.rooms.retrieve(roomId);
    if (!room) return;

    socket.join(roomId);
    if (room.join) room.join(clientId, params);
    this.logger.debug(`${clientId} join ${roomId}`);

    socket.on("disconnect", () => {
      socket.leave(roomId)
      if (room.leave) room.leave(clientId, params);
      this.logger.debug(`${clientId} leave ${roomId}`);
    });

    room.on(params).then(data =>
      this.emitter.broadcastTo(clientId, roomId, data));
  }
}
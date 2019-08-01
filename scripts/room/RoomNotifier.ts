import { injectable, inject } from "inversify";
import { ILogger } from "signs-js";

import { IRoomRetriever } from "./IRoomRetriever";
import { IRoomNotifier } from './IRoomNotifier';
import { IMessageEmitter } from "../socket/ISocket";

@injectable()
export class RoomNotifier implements IRoomNotifier {
  constructor(@inject("IMessageEmitter") private emitter: IMessageEmitter,
    @inject("IRoomRetriever") private retriever: IRoomRetriever,
    @inject("ILogger") private logger: ILogger) {
    this.logger.setContext('RoomRefresher');
  }

  async notify(roomId: string): Promise<void> {
    this.logger.debug(`Notify room ${roomId}`);
    const { room, params } = this.retriever.retrieve(roomId);

    return room && room.on(params).then(data =>
      this.emitter.emitTo(roomId, data));
  }
}
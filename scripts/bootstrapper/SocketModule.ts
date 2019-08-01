import { interfaces } from "inversify";
import { IServer, IModule } from 'signs-js';
import { Server } from "signs-js/dist/engine/Server";

import { RoomNotifier } from "../room/RoomNotifier";
import { SocketServer } from '../socket/SocketServer';
import { RoomExtractor } from "../room/RoomExtractor";
import { IRoomNotifier } from "../room/IRoomNotifier";
import { RoomRetriever } from '../room/RoomRetriever';
import { IRoomExtractor } from "../room/IRoomExtractor";
import { IRoomRetriever } from '../room/IRoomRetriever';
import { SocketConnector } from "../socket/SocketConnector";
import { IServerRetriever, IMessageEmitter, ISocketConnector } from "../socket/ISocket";

export class SocketModule implements IModule {
  modules(container: interfaces.Container): void {
    container.unbind("IServer");
    container.bind<IServer>("Server").to(Server).whenInjectedInto(SocketServer);
    container.bind<IServer>("IServer").to(SocketServer).inSingletonScope();

    container.bind<IServerRetriever>("IServerRetriever").toDynamicValue(() =>
      container.get<SocketServer>('IServer')).inSingletonScope();

    container.bind<IMessageEmitter>("IMessageEmitter").toDynamicValue(() =>
      container.get<SocketServer>('IServer')).inSingletonScope();

    container.bind<IRoomExtractor>("IRoomExtractor").to(RoomExtractor);
    container.bind<IRoomNotifier>("IRoomNotifier").to(RoomNotifier);
    container.bind<IRoomRetriever>("IRoomRetriever").to(RoomRetriever).inSingletonScope();

    container.bind<ISocketConnector>("ISocketConnector").to(SocketConnector).inSingletonScope();
  }
}
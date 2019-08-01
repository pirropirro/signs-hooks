import { Server, Socket } from "socket.io";

export interface IServerRetriever {
  retrieve(): Server;
}

export interface ISocketConnector {
  connect(socket: Socket): void;
}

export interface IMessageEmitter {
  emitTo<T>(roomId: string, data: T): void;
  broadcastTo<T>(clientId: string, roomId: string, data?: T): void;
}

export interface ISocketConfig {
  prefix: string;
}
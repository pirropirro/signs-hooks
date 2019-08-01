
import * as http from "http";
import * as io from "socket.io";
import { Application } from "express";
import { inject, injectable } from "inversify";
import { ILogger, IServer, IServerConfig } from "signs-js";

import { IServerRetriever, IMessageEmitter, ISocketConfig } from './ISocket';

@injectable()
export class SocketServer implements IServer, IServerRetriever, IMessageEmitter {
  public app: Application;
  private socket: io.Server;
  private server: http.Server;

  constructor(@inject("Server") original: IServer,
    @inject("IServerConfig") private serverConfig: IServerConfig,
    @inject("ISocketConfig") private socketConfig: ISocketConfig,
    @inject("ILogger") private logger: ILogger) {
    this.logger.setContext("SocketServer")
    this.app = original.app;

    this.server = http.createServer(this.app);
    this.socket = io(this.server);
  }

  start(): void {
    const { port, ipaddress } = this.serverConfig;
    this.server.listen(port, ipaddress, () =>
      this.logger.info(`Listen on ${ipaddress}:${port}...`));
  }

  retrieve(): io.Server {
    return this.socket;
  }

  emitTo(roomId: string, data: any = {}): void {
    roomId = `${this.socketConfig.prefix}${roomId}`;
    this.logger.debug(`Emit to ${roomId} with ${JSON.stringify(data)}`);
    this.socket.to(roomId).emit(roomId, data);
  }

  broadcastTo(clientId: string, roomId: string, data: any = {}): void {
    roomId = `${this.socketConfig.prefix}${roomId}`;
    this.logger.debug(`Broadcast to ${clientId} on ${roomId} with ${JSON.stringify(data)}`);
    this.socket.to(clientId).emit(roomId, data);
  }
}

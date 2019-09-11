import { IModule, IApplication } from 'signs-js';

import { SocketModule } from './SocketModule';
import { ISocketConnector, IServerRetriever } from '../socket/ISocket';

export class SocketApplication implements IApplication {
  constructor(private app: IApplication) {
    this.app.register(new SocketModule());
  }

  get container() {
    return this.app.container;
  }

  register(module: IModule): IApplication {
    return this.app.register(module);
  }

  run() {
    this.app.run();

    const server = this.app.container.get<IServerRetriever>("IServerRetriever").retrieve();
    const connector = this.app.container.get<ISocketConnector>("ISocketConnector");
    server.on("connection", socket => connector.connect(socket));
  }
}
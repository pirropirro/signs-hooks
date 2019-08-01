import { Application } from 'signs-js';

import { SocketModule } from './SocketModule';
import { ISocketConnector, IServerRetriever } from '../socket/ISocket';

export class SocketApplication extends Application {
  constructor() {
    super()
    this.register(new SocketModule());
  }

  run() {
    super.run();

    const server = this.container.get<IServerRetriever>("IServerRetriever").retrieve();
    const connector = this.container.get<ISocketConnector>("ISocketConnector");
    server.on("connection", socket => connector.connect(socket));
  }
}
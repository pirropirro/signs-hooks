import { Socket } from 'socket.io';

export interface IRoomExtractor {
  extractFrom(socket: Socket): string;
}
import * as match from "path-match";
import * as ptr from "path-to-regexp";
import { multiInject, injectable } from "inversify";

import { IRoom, getRoomLocation } from "./IRoom";
import { IRoomRetriever, RetrieverResponse } from "./IRoomRetriever";

@injectable()
export class RoomRetriever implements IRoomRetriever {
  constructor(@multiInject("IRoom") private rooms: IRoom[]) { }

  retrieve<T>(roomId: string): RetrieverResponse<T> {
    const room = this.rooms.find((r => roomId.match(ptr(getRoomLocation(r)))));
    if (!room) return {} as RetrieverResponse<T>;

    const location = getRoomLocation(room);
    return { room, location, params: this.extractParameters<T>(location, roomId) };
  }

  private extractParameters<T>(location: string, roomId: string): T {
    return match()(location)(roomId);
  }
}
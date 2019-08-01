import { IRoom } from "./IRoom";

export type RetrieverResponse<T> = { room: IRoom<T>, location: string, params?: T }

export interface IRoomRetriever {
  retrieve<T>(roomId: string): RetrieverResponse<T>;
}
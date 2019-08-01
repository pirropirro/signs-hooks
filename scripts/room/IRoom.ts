import { interfaces, decorate, injectable } from "inversify";

export type RoomResponse = {
  url: string;
  [key: string]: any;
}

export interface IRoom<T = any> {
  on(parameters?: T): Promise<RoomResponse>;
}

export function Room(location: string) {
  return function (target: interfaces.Newable<any>) {
    decorate(injectable(), target);
    Reflect.defineMetadata("room:location", location, target);
    return target;
  };
}

export function getRoomLocation<T>(room: IRoom<T>): string {
  return Reflect.getMetadata(`room:location`, room.constructor)
}
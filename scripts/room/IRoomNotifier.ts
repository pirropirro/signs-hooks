export interface IRoomNotifier {
  notify(roomId: string): Promise<void>
}
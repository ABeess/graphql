import { Server } from 'socket.io';

type SocketType = Server;

declare global {
  var _io: SocketType;
}

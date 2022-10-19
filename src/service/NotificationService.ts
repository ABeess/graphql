import { Socket } from 'socket.io';

export default class NotificationService {
  constructor(socket: Socket) {
    socket.on('NOTIFICATION', () => {});
  }
}

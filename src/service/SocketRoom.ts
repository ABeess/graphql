import { Socket } from 'socket.io';
import { v4 } from 'uuid';
import UserRoom from '../entities/UserRoom';

export default class SocketRoom {
  constructor(socket: Socket) {
    socket.on('disconnect', () => {
      console.log('user disconnect');
    });

    socket.on('CREATE_ROOM', async (userId: string, room?: string) => {
      try {
        const newRoom = UserRoom.create({
          userId,
          room: room ? `${room}-${v4()}` : v4(),
        });
        await newRoom.save();
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('POST_ROOM', (room: string[]) => {
      socket.join(room);
    });

    socket.on('JOIN_ROOM', async (userId: string) => {
      try {
        console.log('Join Room', userId);
        const userRoom = await UserRoom.find({
          where: {
            userId,
          },
        });
        _io.emit('JOIN_ROOM', 'test');
        const room = userRoom.map((item) => item.room);
        socket.join(room);
      } catch (error) {
        console.log(error);
      }
    });
  }
}

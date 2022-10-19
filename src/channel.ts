import { Server } from 'socket.io';
import { Server as httpServer } from 'http';
import SocketRoom from './service/SocketRoom';

export const channel = (server: httpServer) => {
  const io = new Server(server, {
    cors: { origin: [process.env.CLIENT_URL, 'http://localhost:3030'], credentials: true },
  });

  global._io = io;

  io.on('connection', (socket) => {
    new SocketRoom(socket);

    // socket.on('NOTIFICATION', () => {
    //   socket.emit("NOTIFICATION", "message")
    // });
    // End
  });
};

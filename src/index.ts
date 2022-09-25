import 'dotenv/config';
import 'reflect-metadata';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
// import { ApolloServer } from 'apollo-server-express';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { createServer } from 'http';
import { buildSchema } from 'type-graphql';
import { AppDataSource } from './lib/dataSource';
import { Context } from './types';
import { redis } from './utils/redis';
import cors from 'cors';
import rootRouter from './routes/rootRouter';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

const main = async (): Promise<void> => {
  // const upload = multer({ storage: multer.diskStorage({}) });
  const app = express();

  const httpServer = createServer(app);

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      origin: ['http://localhost:3090'],
      credentials: true,
    })
  );

  app.use(
    session({
      name: 'session-cookie',
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      },
      store: new RedisStore({ client: redis }),
      secret: String(process.env.SESSION_SECRET),
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use('/', rootRouter);

  const schema = await buildSchema({
    resolvers: [__dirname + '/resolvers/**/*.js'],
  });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },

      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      // ApolloServerPluginLandingPageGraphQLPlayground,
    ],
    context: ({ req, res }: Pick<Context, 'req' | 'res'>) => ({ req, res }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: [process.env.CLIENT_URL as string],
      credentials: true,
    },
  });

  const PORT = process.env.PORT || 3088;

  await new Promise((resolve) => httpServer.listen(PORT, resolve as () => void));

  await AppDataSource.connect();
  console.log('<-- Connect DB -->');
  console.log(`Graphql endpoint on: http://localhost:${PORT}${apolloServer.graphqlPath}`);
};

main().catch((error) => console.log('Server Error: ', error));

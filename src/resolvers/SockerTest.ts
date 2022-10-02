import { withFilter } from 'graphql-subscriptions';
import { Arg, Field, Mutation, ObjectType, Resolver, Root, Subscription } from 'type-graphql';
import { pubsub } from '../utils/pubsub';

@ObjectType()
class SocketReturn {
  @Field()
  date: string;
}

@Resolver()
export class WebSocketServer {
  @Subscription({
    // topics: 'notic',
    subscribe: withFilter(
      () => {
        return pubsub.asyncIterator(['notic', 'notic4']);
      },
      async (payload, args) => {
        console.log(args);
        console.log(payload);
        return args.room === '1';
      }
    ),
  })
  listenTest(@Root() { date }: SocketReturn, @Arg('room') _room: string): SocketReturn {
    return { date };
  }

  @Mutation(() => SocketReturn)
  async mutationTest(@Arg('name') name: string): Promise<SocketReturn> {
    await pubsub.publish('notic4', { date: name });

    return { date: name };
  }
}

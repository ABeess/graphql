import { withFilter } from 'graphql-subscriptions';
import { Arg, Field, Mutation, ObjectType, Resolver, Root, Subscription } from 'type-graphql';
import User from '../entities/User';
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
      async (root, args, context) => {
        const user = (await User.find({})).map((item) => item.id);

        console.log(user.includes('be30036a-35e1-4dd0-b83c-6eefb11be35b'));
        return args.room === '1';
      }
    ),
  })
  listenTest(@Root() { date }: SocketReturn, @Arg('room') room: string): SocketReturn {
    return { date };
  }

  @Mutation(() => SocketReturn)
  async mutationTest(@Arg('name') name: string): Promise<SocketReturn> {
    await pubsub.publish('notic4', { date: name });

    return { date: name };
  }
}

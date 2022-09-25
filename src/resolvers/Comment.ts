import {
  Arg,
  Args,
  Mutation,
  PubSub,
  PubSubEngine,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql';
import { CommentPayload, CommentResponse } from '../types/comment';

@Resolver()
export default class CommentResolver {
  @Subscription({
    topics: 'comment',
  })
  listenComment(@Root() { message }: CommentPayload): CommentResponse {
    return { date: new Date(), message };
  }

  @Mutation(() => CommentResponse)
  async mutationComment(
    @PubSub() pubsub: PubSubEngine,
    @Arg('message', { nullable: true }) message: string
  ): Promise<CommentResponse> {
    const payload: CommentPayload = {
      message,
    };
    await pubsub.publish('comment', payload);

    return {
      message,
      date: new Date(),
    };
  }
}

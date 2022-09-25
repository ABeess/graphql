import {
  Arg,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql';
import Comment from '../entities/Comment';
import { CommentInput, ReplyInput } from '../inputs/CommentInput';
import { CommentPayload, CommentResponseTest } from '../types/comment';
import { CommentResponse } from '../types/response';
import { generateError } from '../utils/responseError';

@Resolver()
export default class CommentResolver {
  @Subscription({
    topics: 'commentTest',
  })
  listenCommentTest(@Root() { message }: CommentPayload): CommentResponseTest {
    return { date: new Date(), message };
  }

  @Subscription({
    topics: 'comment-post',
  })
  listenCommentPost(@Root() comment: Comment): Comment {
    console.log(comment);
    return comment;
  }

  @Mutation(() => CommentResponseTest)
  async mutationComment(
    @PubSub() pubsub: PubSubEngine,
    @Arg('message', { nullable: true }) message: string
  ): Promise<CommentResponseTest> {
    const payload: CommentPayload = {
      message,
    };
    await pubsub.publish('commentTest', payload);

    return {
      message,
      date: new Date(),
    };
  }

  @Mutation(() => CommentResponse)
  async createComment(
    @PubSub() pubsub: PubSubEngine,
    @Arg('commentInput') commentInput: CommentInput
  ): Promise<CommentResponse> {
    try {
      const newComment = Comment.create({
        ...commentInput,
      });

      await newComment.save();

      await pubsub.publish('comment-post', newComment);

      return {
        code: 200,
        message: 'createComment',
        comment: newComment,
      };
    } catch (error) {
      console.log(error);
      return generateError(error);
    }
  }

  @Mutation(() => CommentResponse)
  async replyComment(
    @PubSub() pubsub: PubSubEngine,
    @Arg('replyInput') replyInput: ReplyInput
  ): Promise<CommentResponse> {
    try {
      const { comment } = replyInput;

      const updateComment = await Comment.createQueryBuilder()
        .update({ id: comment?.id })
        .returning('*')
        .execute();

      await pubsub.publish('comment-post', updateComment.raw[0]);

      return {
        code: 200,
        message: 'createComment',
        comment: updateComment.raw[0],
      };
    } catch (error) {
      console.log(error);
      return generateError(error);
    }
  }

  @Query(() => [Comment])
  async comments(@Arg('postId') id: number): Promise<Comment[]> {
    const commentList = await Comment.find({
      where: {
        post: {
          id,
        },
      },
      relations: ['user', 'post'],
      order: {
        createdAt: 'DESC',
      },
    });

    return commentList;
  }
}

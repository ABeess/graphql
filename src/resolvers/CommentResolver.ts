import { withFilter } from 'graphql-subscriptions';
import { Arg, Mutation, Query, Resolver, Root, Subscription, UseMiddleware } from 'type-graphql';
import Comment from '../entities/Comment';
import ReplyCommentPost from '../entities/Reply';
import { CommentInput, ReplyInput } from '../inputs/CommentInput';
import { QueryInput } from '../inputs/QueryInput';
import { authentication } from '../middleware/authentication';
import { CommentPayload } from '../response/PayloadResponse';
import { CommentListResponse } from '../response/PostResponse';
import { pubsub } from '../utils/pubsub';
import { queryGenerate } from '../utils/queryGenerate';

@Resolver()
export default class CommentResolver {
  @Subscription({
    subscribe: withFilter(
      () => pubsub.asyncIterator(['COMMENT_POST', 'REPLY_COMMENT']),
      (payload: CommentPayload, args) => {
        console.log(args);
        return args.room === payload.room;
      }
    ),
  })
  listJoinCommentPost(@Arg('room') _room: string, @Root() payload: CommentPayload): CommentPayload {
    return payload;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(authentication)
  async createComment(
    @Arg('commentInput') commentInput: CommentInput,
    @Arg('room') room: string
  ): Promise<Boolean> {
    try {
      const newComment = Comment.create({
        message: commentInput.message,
        author: commentInput.author,
        post: commentInput.post,
      });

      await newComment.save();

      await pubsub.publish('COMMENT_POST', {
        data: newComment,
        room,
        type: 'comment',
        commentId: newComment.id,
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(authentication)
  async replyComment(
    @Arg('room') room: string,
    @Arg('replyInput') replyInput: ReplyInput
  ): Promise<boolean> {
    try {
      const reply = ReplyCommentPost.create({
        author: replyInput.author,
        message: replyInput.message,
        parent: replyInput.comment,
      });

      await reply.save();

      await pubsub.publish('REPLY_COMMENT', {
        room,
        data: reply,
        type: 'reply',
        commentId: reply.parent.id,
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  @Query(() => CommentListResponse)
  @UseMiddleware(authentication)
  async comments(
    @Arg('postId') id: string,
    @Arg('query', { nullable: true }) query: QueryInput
  ): Promise<CommentListResponse> {
    const { page, limit, skip } = queryGenerate(query);

    const [commentList, count] = await Comment.findAndCount({
      where: {
        post: {
          id,
        },
      },
      skip: skip,
      take: limit,
      relationLoadStrategy: 'join',
      relations: ['author', 'post', 'reply', 'reply.author'],
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      comment: commentList,
      totalCount: count,
      totalPage: Math.ceil(count / Number(limit)),
      perPage: count < Number(limit) ? 1 : limit,
      page: page,
    };
  }
}

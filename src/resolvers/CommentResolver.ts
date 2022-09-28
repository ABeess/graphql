import {
  Arg,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  ResolverFilterData,
  Root,
  Subscription,
  UseMiddleware,
} from 'type-graphql';
import Comment from '../entities/Comment';
import ReplyCommentPost from '../entities/Reply';
import { CommentInput, ReplyInput } from '../inputs/CommentInput';
import { QueryInput } from '../inputs/QueryInput';
import { authentication } from '../middleware/authentication';
import { CommentListResponse, CommentResponse } from '../types/response';
import { queryGenerate } from '../utils/queryGenerate';
import { generateError } from '../utils/responseError';

@Resolver()
export default class CommentResolver {
  @Subscription({
    // topics: 'comment-post',
    topics: ({ args }: ResolverFilterData) => {
      return args.room;
    },
    // filter: ({ args, payload }: ResolverFilterData<CommentPayload>) =>
    //   payload.type === 'comment'
    //     ? args.room.includes(payload.comment.post.uuid)
    //     : args.room.includes(payload.comment.uuid),
  })
  @UseMiddleware(authentication)
  listenCommentPost(@Arg('room') _room: string, @Root() comment: Comment): Comment {
    return comment;
  }

  @Mutation(() => CommentResponse)
  async createComment(
    @PubSub() pubsub: PubSubEngine,
    @Arg('commentInput') commentInput: CommentInput,
    @Arg('room', { nullable: true }) room: string
  ): Promise<CommentResponse> {
    try {
      const newComment = Comment.create({
        message: commentInput.message,
        author: commentInput.author,
        post: commentInput.post,
      });

      await newComment.save();

      await pubsub.publish(room, newComment);

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

  @Subscription({
    topics: ({ args }: ResolverFilterData) => {
      return args.room;
    },
  })
  @UseMiddleware(authentication)
  listenReply(@Arg('room') _room: string, @Root() reply: ReplyCommentPost): ReplyCommentPost {
    return reply;
  }

  @Mutation(() => CommentResponse)
  @UseMiddleware(authentication)
  async replyComment(
    @PubSub() pubsub: PubSubEngine,
    @Arg('room') room: string,
    @Arg('replyInput') replyInput: ReplyInput
  ): Promise<CommentResponse> {
    try {
      const reply = ReplyCommentPost.create({
        author: replyInput.author,
        message: replyInput.message,
        parent: replyInput.comment,
      });

      await reply.save();

      await pubsub.publish(room, reply);

      return {
        code: 200,
        message: 'Reply',
        reply: reply,
      };
    } catch (error) {
      console.log(error);
      return generateError(error);
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
      perPage: limit,
      page: page,
    };
  }
}

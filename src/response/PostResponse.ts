import { Field, ObjectType } from 'type-graphql';
import Comment from '../entities/Comment';
import Post from '../entities/Post';
import PostLike from '../entities/PostLike';
import ReplyCommentPost from '../entities/Reply';
import { BaseResponse, QueryResponse } from './BaseResponse';

@ObjectType({ implements: BaseResponse })
export class PostResponse implements BaseResponse {
  code: number;
  message: string;

  @Field(() => Post, { nullable: true })
  post?: Post;
}

@ObjectType({ implements: QueryResponse })
export class AllPostResponse implements QueryResponse {
  totalCount?: number;
  limit?: number;
  perPage?: number;
  page?: number;
  totalPage?: number;
  commentCount?: number;

  @Field(() => [Post], { nullable: true })
  posts?: Post[];
}

@ObjectType({ implements: BaseResponse })
export class CommentResponse implements BaseResponse {
  code: number;
  message: string;

  @Field(() => Comment, { nullable: true })
  comment?: Partial<Comment> | Partial<ReplyCommentPost>;

  @Field(() => ReplyCommentPost, { nullable: true })
  reply?: ReplyCommentPost;
}

@ObjectType({ implements: BaseResponse })
export class AllCommentResponse implements BaseResponse {
  code: number;
  message: string;

  @Field(() => [Comment], { nullable: true })
  comment?: Comment[];
}

@ObjectType({ implements: QueryResponse })
export class CommentListResponse implements QueryResponse {
  @Field(() => [Comment], { nullable: true })
  comments?: Comment[];

  totalCount?: number;
  limit?: number;
  perPage?: number;
  page?: number;
  totalPage?: number;
}

@ObjectType()
export class CurrentLike {
  @Field({ nullable: true })
  like: boolean;

  @Field({ nullable: true })
  type?: string;
}

@ObjectType({ implements: BaseResponse })
export class PostLikeQueryResponse implements BaseResponse {
  code: number;
  message: string;

  @Field(() => [PostLike], { nullable: true })
  likes?: PostLike[];

  @Field({ nullable: true })
  totalLike?: number;

  @Field({ nullable: true })
  currentLike?: CurrentLike;
}

@ObjectType({ implements: BaseResponse })
export class PostLikeMutationResponse implements BaseResponse {
  code: number;
  message: string;

  @Field(() => PostLike, { nullable: true })
  likes?: PostLike;

  @Field({ nullable: true })
  currentLike?: CurrentLike;
}

@ObjectType({ implements: BaseResponse })
export class UnlikePostMutationResponse implements BaseResponse {
  code: number;
  message: string;
}

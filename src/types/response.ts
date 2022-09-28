import { Field, InterfaceType, ObjectType } from 'type-graphql';
import { Post, User } from '../entities';
import Comment from '../entities/Comment';
import PostLike from '../entities/PostLike';
import ReplyCommentPost from '../entities/Reply';

@InterfaceType()
export abstract class BaseResponse {
  @Field(() => Number, { nullable: true })
  code: number;

  @Field(() => String, { nullable: true })
  message: string;
}

@InterfaceType()
export abstract class QueryResponse {
  @Field({ nullable: true })
  totalCount?: number;

  @Field({ nullable: true })
  totalPage?: number;

  @Field({ nullable: true })
  limit?: number;

  @Field({ nullable: true })
  perPage?: number;

  @Field({ nullable: true })
  page?: number;

  @Field({ nullable: true })
  skip?: number;
}

@ObjectType({ implements: BaseResponse })
export class UserResponse implements BaseResponse {
  code: number;

  message: string;

  @Field(() => User, { nullable: true })
  user?: Partial<User>;

  @Field(() => String, { nullable: true })
  accessToken?: string;
}

@ObjectType({ implements: BaseResponse })
export class UserLogoutResponse implements BaseResponse {
  code: number;

  message: string;
}

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
export class NotificationResponse implements BaseResponse {
  code: number;
  message: string;

  @Field()
  notification: string;
}

@ObjectType({ implements: BaseResponse })
export class CommentResponse implements BaseResponse {
  code: number;
  message: string;

  @Field(() => Comment, { nullable: true })
  comment?: Comment | ReplyCommentPost;

  @Field(() => ReplyCommentPost, { nullable: true })
  reply?: ReplyCommentPost;
}

@ObjectType({ implements: BaseResponse })
export class AllCommentResponse implements BaseResponse {
  code: number;
  message: string;

  @Field(() => [Comment!]!, { nullable: true })
  comment?: Comment[];
}

@ObjectType({ implements: QueryResponse })
export class CommentListResponse implements QueryResponse {
  @Field(() => [Comment], { nullable: true })
  comment?: Comment[];

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

import { Field, InterfaceType, ObjectType } from 'type-graphql';
import { Post, User } from '../entities';
import Comment from '../entities/Comment';

@InterfaceType()
export abstract class BaseResponse {
  @Field(() => Number, { nullable: true })
  code: number;

  @Field(() => String, { nullable: true })
  message: string;
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
export class PostResponse implements BaseResponse {
  code: number;
  message: string;

  @Field(() => Post, { nullable: true })
  post?: Post;
}

@ObjectType({ implements: BaseResponse })
export class AllPostResponse {
  @Field(() => Post, { nullable: true })
  posts?: Post;
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
  comment?: Comment;
}

@ObjectType({ implements: BaseResponse })
export class AllCommentResponse implements BaseResponse {
  code: number;
  message: string;

  @Field(() => [Comment!]!, { nullable: true })
  comment?: Comment[];
}

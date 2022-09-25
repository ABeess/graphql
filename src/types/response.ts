import { Field, InterfaceType, ObjectType } from 'type-graphql';
import { Post, User } from '../entities';

@InterfaceType()
export abstract class BaseResponse {
  @Field(() => Number)
  code: number;

  @Field(() => String)
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

import { Field, ObjectType } from 'type-graphql';
import User from '../entities/User';
import UserProfile from '../entities/UserProfile';
import { BaseResponse, QueryResponse } from './BaseResponse';

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
export class ProfileUserResponse implements BaseResponse {
  code: number;
  message: string;
  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType({ implements: BaseResponse })
export class UserNotCurrentResponse implements BaseResponse {
  code: number;

  message: string;

  @Field(() => [User], { nullable: true })
  users?: Partial<User[]>;
}

@ObjectType({ implements: BaseResponse })
export class UpdateUserProfileResponse implements BaseResponse {
  code: number;
  message: string;

  @Field(() => UserProfile, { nullable: true })
  profile?: UserProfile;

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType({ implements: BaseResponse })
export class UploadAvatarResponse implements BaseResponse {
  code: number;
  message: string;

  @Field({ nullable: true })
  url?: string;
}

@ObjectType({ implements: QueryResponse })
export class GetFriendResponse implements QueryResponse {
  totalCount?: number;
  totalPage?: number;
  perPage?: number;
  page?: number;

  @Field(() => [User], { nullable: true })
  friends: User[];
}

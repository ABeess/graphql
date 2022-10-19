import { Field, ObjectType } from 'type-graphql';
import Friendship from '../entities/Friendship';
import User from '../entities/User';
import { BaseResponse, QueryResponse } from './BaseResponse';

@ObjectType({ implements: BaseResponse })
export class AddFriendMutationResponse implements BaseResponse {
  code: number;
  message: string;

  @Field({ nullable: true })
  addressee?: User;
}

@ObjectType()
export class FriendNotificationResponse {
  @Field()
  message: string;

  @Field({ nullable: true })
  addressee: string;

  @Field({ nullable: true })
  requester: User;
}

@ObjectType({ implements: QueryResponse })
export class FriendShipRequestResponse {
  @Field(() => [Friendship], { nullable: true })
  friendRequest: Friendship[];

  totalCount?: number;
  perPage?: number;
  page?: number;
  totalPage?: number;
}

@ObjectType({ implements: QueryResponse })
export class FriendShipRecommendResponse implements QueryResponse {
  @Field(() => [User], { nullable: true })
  users?: Partial<User[]>;

  totalCount?: number;
  perPage?: number;
  page?: number;
  totalPage?: number;
}

import { GraphQLJSONObject } from 'graphql-type-json';
import { Field, InputType } from 'type-graphql';
import Friendship from '../entities/Friendship';
import User from '../entities/User';

@InputType()
export class AddFriendInput implements Partial<Friendship> {
  @Field(() => GraphQLJSONObject)
  requester: User;

  @Field(() => GraphQLJSONObject)
  addressee: User;

  @Field()
  type?: string;
}

@InputType()
export class AcceptFriendInput implements Partial<Friendship> {
  @Field()
  id: string;

  @Field(() => GraphQLJSONObject)
  addressee: User;

  @Field()
  type?: string;
}

@InputType()
export class UserQueryInput implements Partial<User> {
  @Field()
  id: string;
}

@InputType()
export class FriendShipRequestInputQuery {
  @Field()
  addressee: string;
}

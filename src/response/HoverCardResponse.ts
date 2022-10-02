import { Field, ObjectType } from 'type-graphql';
import User from '../entities/User';

@ObjectType()
export class HoverCardResponse {
  @Field({ nullable: true })
  user?: User;

  @Field()
  isFriend: boolean;
}

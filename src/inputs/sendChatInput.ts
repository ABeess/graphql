import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import { Field, InputType } from 'type-graphql';
import User from '../entities/User';

@InputType()
export class SendChatInput {
  @Field()
  message: string;

  @Field(() => GraphQLJSONObject)
  sender: User;

  @Field()
  conversationId: string;

  @Field(() => [String])
  receiveId: string[];
}

@InputType()
export class CreateConversationInput {
  @Field()
  senderId: string;

  @Field(() => GraphQLJSON)
  receiverId: string[];
}

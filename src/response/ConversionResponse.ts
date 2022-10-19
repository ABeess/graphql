import { Field, ObjectType } from 'type-graphql';
import Conversation from '../entities/Conversation';
import { Maybe } from '../types/index';
import { BaseResponse } from './BaseResponse';

@ObjectType({ implements: BaseResponse })
export class CreateConversationResponse implements BaseResponse {
  code: number;
  message: string;

  @Field(() => Conversation, { nullable: true })
  conversation?: Maybe<Conversation>;
}

@ObjectType({ implements: BaseResponse })
export class ConversationResponse implements BaseResponse {
  code: number;
  message: string;

  @Field(() => [Conversation], { nullable: true })
  conversations?: Conversation[];
}

import { Field, ObjectType } from 'type-graphql';
import Participants from '../entities/Participants';
import Message from '../entities/Message';
import { BaseResponse } from './BaseResponse';

@ObjectType({ implements: BaseResponse })
export class ListChatSideBarResponse implements BaseResponse {
  code: number;
  message: string;
  @Field(() => [Participants], { nullable: true })
  sidebar?: Participants[];
}

@ObjectType({ implements: BaseResponse })
export class ListChatResponse implements BaseResponse {
  code: number;
  message: string;
  @Field(() => [Message], { nullable: true })
  chats?: Message[];
}

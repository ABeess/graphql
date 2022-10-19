import { ObjectType } from 'type-graphql';
import { BaseResponse } from './BaseResponse';

@ObjectType({ implements: BaseResponse })
export class CreateCommentResponse implements BaseResponse {
  code: number;
  message: string;
}

@ObjectType({ implements: BaseResponse })
export class ReplyResponse implements BaseResponse {
  code: number;
  message: string;
}

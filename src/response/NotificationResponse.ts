import { Field, ObjectType } from 'type-graphql';
import Notification from '../entities/Notification';
import { BaseResponse, QueryResponse } from './BaseResponse';

@ObjectType({ implements: QueryResponse })
export class NotificationQueryResponse implements QueryResponse {
  @Field()
  totalUnread: number;

  @Field(() => [Notification], { nullable: true })
  notifications: Notification[];

  totalCount?: number;
  perPage?: number;
  page?: number;
  totalPage?: number;
}

@ObjectType({ implements: BaseResponse })
export class MaskAsReadResponse implements BaseResponse {
  code: number;
  message: string;
}

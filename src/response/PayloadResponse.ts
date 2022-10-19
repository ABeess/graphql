import { ClassType, Field, ObjectType } from 'type-graphql';
import Comment from '../entities/Comment';
import Notification from '../entities/Notification';
import ReplyCommentPost from '../entities/Reply';

export function ServiceResponse<T>(cls: ClassType<T>) {
  @ObjectType({ isAbstract: true })
  abstract class ServiceResponse {
    @Field()
    room?: string;

    @Field(() => cls, { nullable: true })
    data: T;
  }

  return ServiceResponse;
}

export function CommentResponse<T>(cls: ClassType<T>) {
  @ObjectType({ isAbstract: true })
  abstract class ServiceResponse {
    @Field()
    room?: string;

    @Field({ nullable: true })
    type?: string;

    @Field({ nullable: true })
    commentId?: string;

    @Field(() => cls, { nullable: true })
    data: T;
  }

  return ServiceResponse;
}

@ObjectType()
export class FriendshipPayload extends ServiceResponse(Notification) {}

@ObjectType()
export class CommentPayload extends CommentResponse(Comment) {}

@ObjectType()
export class ReplyPayload extends ServiceResponse(ReplyCommentPost) {}

import { ArgsType, Field } from 'type-graphql';
import Comment from '../entities/Comment';

@ArgsType()
export class TopicPost {
  @Field(() => [String])
  room: string[];
}

export interface CommentPayload {
  type: string;
  comment: Comment;
}

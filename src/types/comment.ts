import { Field, ObjectType } from 'type-graphql';
import Comment from '../entities/Comment';

export class CommentPayload {
  type: string;
  @Field()
  comment: Comment;
}

@ObjectType()
export class CommentResponseTest {
  @Field()
  message?: string;

  @Field()
  date?: Date;
}

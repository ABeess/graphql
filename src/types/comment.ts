import { Field, ObjectType } from 'type-graphql';

export class CommentPayload {
  @Field()
  message: string;
}

@ObjectType()
export class CommentResponseTest {
  @Field()
  message?: string;

  @Field()
  date?: Date;
}

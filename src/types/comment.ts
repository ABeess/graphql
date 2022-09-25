import { Field, ObjectType } from 'type-graphql';

export class CommentPayload {
  @Field()
  message: string;
}

@ObjectType()
export class CommentResponse {
  @Field()
  message?: string;

  @Field()
  date?: Date;
}

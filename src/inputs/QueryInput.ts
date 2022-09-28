import { Field, InputType } from 'type-graphql';

@InputType()
export class QueryInput {
  @Field({ nullable: true })
  skip?: number;

  @Field({ nullable: true })
  take?: number;

  @Field({ nullable: true })
  limit?: number;

  @Field({ nullable: true })
  page?: number;
}

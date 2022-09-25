import { GraphQLJSONObject } from 'graphql-type-json';
import { Field, InputType } from 'type-graphql';
import { Post, User } from '../entities';

@InputType()
export class PostInput implements Partial<Post> {
  @Field()
  content: string;

  @Field({ nullable: true })
  caption: string;

  @Field({ nullable: true })
  status: string;

  @Field({ nullable: true })
  checking: string;

  @Field({ nullable: true })
  visible: string;

  @Field(() => GraphQLJSONObject)
  user: User;
}

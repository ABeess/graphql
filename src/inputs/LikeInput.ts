import { GraphQLJSONObject } from 'graphql-type-json';
import { Field, InputType } from 'type-graphql';
import Post from '../entities/Post';
import User from '../entities/User';

@InputType()
export class PostLikeQueryInput {
  @Field()
  userId: string;

  @Field()
  postId: string;

  @Field({ nullable: true })
  type?: string;
}

@InputType()
export class PostLikeMutationInput {
  @Field(() => GraphQLJSONObject)
  user?: User;

  @Field(() => GraphQLJSONObject)
  post?: Post;

  @Field({ nullable: true })
  type?: string;
}

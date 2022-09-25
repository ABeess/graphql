import { GraphQLJSONObject } from 'graphql-type-json';
import { Field, InputType } from 'type-graphql';
import { Post, User } from '../entities';
import Comment from '../entities/Comment';

@InputType()
export class CommentInput implements Partial<Comment> {
  @Field()
  message: string;

  @Field(() => GraphQLJSONObject)
  post: Post;

  @Field(() => GraphQLJSONObject)
  user: User;

  @Field({ nullable: true })
  type?: string;
}

@InputType()
export class ReplyInput implements Partial<Comment> {
  @Field()
  message: string;

  @Field(() => GraphQLJSONObject)
  post: Post;

  @Field(() => GraphQLJSONObject)
  user: User;

  @Field(() => GraphQLJSONObject)
  comment?: Comment;
}

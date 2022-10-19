import { GraphQLJSONObject } from 'graphql-type-json';
import { Field, InputType } from 'type-graphql';
import { Post, User } from '../entities';
import Comment from '../entities/Comment';

@InputType()
export class CommentInput implements Partial<Comment> {
  @Field()
  message: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  post?: Post;

  @Field(() => GraphQLJSONObject)
  author?: User;

  @Field({ nullable: true })
  type?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  comment?: Comment;
}

@InputType()
export class ReplyInput implements Partial<Comment> {
  @Field()
  message: string;

  @Field(() => GraphQLJSONObject)
  author?: User;

  @Field(() => GraphQLJSONObject)
  comment?: Comment;

  @Field()
  postId: string;
}

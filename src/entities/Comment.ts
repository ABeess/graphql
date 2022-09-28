import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import Model from './Model';
import Post from './Post';
import ReplyCommentPost from './Reply';
import User from './User';

@Entity()
@ObjectType()
export default class Comment extends Model {
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.comment)
  @JoinColumn()
  author: User;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.comment, { onDelete: 'CASCADE' })
  @JoinColumn()
  post: Post;

  @Field()
  @Column()
  message: string;

  @Field(() => [ReplyCommentPost], { nullable: true })
  @OneToMany(() => ReplyCommentPost, (reply) => reply.parent)
  reply: ReplyCommentPost[];
}

import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import Model from './Model';
import Post from './Post';
import User from './User';

@Entity()
@ObjectType()
export default class Comment extends Model {
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.comment)
  @JoinColumn()
  user: User;

  // @Field({ nullable: true })
  // @ManyToOne(() => Comment, (comment) => comment.id)
  // @JoinColumn({ name: 'reply' })
  // reply?: string;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.comment)
  @JoinColumn()
  post: Post;

  @Field()
  @Column()
  message: string;
}

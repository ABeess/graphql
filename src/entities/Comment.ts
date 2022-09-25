import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToMany, OneToMany } from 'typeorm';
import Model from './Model';
import Post from './Post';
import User from './User';

@Entity()
@ObjectType()
export default class Comment extends Model {
  @Field(() => User)
  @OneToMany(() => User, (user) => user.comment)
  user: User;

  @Field(() => User)
  @OneToMany(() => User, (user) => user.parent)
  parent: User;

  @Field(() => [Post])
  @ManyToMany(() => Post, (post) => post.comment)
  @JoinColumn()
  post: Post[];

  @Field()
  @Column()
  message: string;
}

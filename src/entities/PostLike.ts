import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Model from './Model';
import Post from './Post';
import User from './User';

@Entity()
@ObjectType()
export default class PostLike extends Model {
  @Field(() => User)
  @ManyToOne(() => Post, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  post: Post;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.postLike, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Field()
  @Column({ default: 'like' })
  type: string;
}

import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Comment from './Comment';
import Model from './Model';
import User from './User';

@Entity()
@ObjectType()
export default class ReplyCommentPost extends Model {
  // @Field(() => [User])
  // @ManyToMany(() => User)
  // @JoinColumn()
  // tagUser: User[];

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.comment)
  @JoinColumn()
  author: User;

  @Field()
  @Column()
  message: string;

  @Field(() => Comment)
  @ManyToOne(() => Comment, (comment) => comment.reply, { onDelete: 'CASCADE' })
  parent: Comment;
}

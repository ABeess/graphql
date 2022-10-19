import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Conversation from './Conversation';
import Model from './Model';
import User from './User';

@Entity()
@ObjectType()
export default class Participants extends Model {
  @Field(() => Conversation)
  @ManyToOne(() => Conversation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  conversation: Conversation;

  @Field({ nullable: true })
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Field({ nullable: true })
  @Column({ nullable: true })
  seen: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true, default: 1 })
  totalUnSeen: number;
}

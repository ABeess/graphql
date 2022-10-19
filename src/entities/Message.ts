import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Conversation from './Conversation';
import Model from './Model';
import User from './User';

@Entity()
@ObjectType()
export default class Message extends Model {
  @Column()
  @Field()
  message: string;

  @Field()
  @ManyToOne(() => User)
  @JoinColumn()
  sender: User;

  @Field()
  @ManyToOne(() => Conversation, (conversation) => conversation.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  conversation: Conversation;
}

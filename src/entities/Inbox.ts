import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Model from './Model';
import User from './User';

@Entity()
@ObjectType()
export default class Inbox extends Model {
  @Field()
  @Column({ unique: true })
  hashInBox: string;

  @Field()
  @Column()
  lastMessage: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  seen: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  totalUnSeen: number;

  @Field({ nullable: true })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  lastSendUser: User;

  @Field()
  @ManyToOne(() => User)
  @JoinColumn()
  sender: User;

  @Field()
  @ManyToOne(() => User)
  @JoinColumn()
  receiver: User;
}

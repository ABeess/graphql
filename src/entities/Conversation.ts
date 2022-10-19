import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import Model from './Model';
import Participants from './Participants';
import User from './User';

@Entity()
@ObjectType()
export default class Conversation extends Model {
  @Column({ nullable: true })
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  @Column({ enum: ['private', 'groups'], default: 'private' })
  type: string;

  @Field({ nullable: true })
  @ManyToOne(() => User)
  @JoinColumn()
  owner: User;

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User)
  @JoinTable()
  receiver: User[];

  @Field(() => [Participants], { nullable: true })
  @ManyToMany(() => Participants)
  @JoinTable()
  participants: Participants[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastMessage: string;

  @Field({ nullable: true })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  lastSendUser: User;
}

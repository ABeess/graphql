import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Model from './Model';
import User from './User';

@Entity()
@ObjectType()
export default class Friendship extends Model {
  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn()
  addressee: User;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn()
  requester: User;

  @Field()
  @Column({ default: false })
  accepted: boolean;
}

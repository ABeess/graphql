import { Field, ObjectType, Resolver } from 'type-graphql';
import { Column, JoinColumn, ManyToOne } from 'typeorm';
import Model from './Model';
import User from './User';

@Resolver()
@ObjectType()
export class Friendship extends Model {
  @Field()
  @ManyToOne(() => User)
  @JoinColumn()
  requester: User;

  @Field()
  @ManyToOne(() => User)
  @JoinColumn()
  addressee: User;

  @Field()
  @Column()
  accepted: boolean;
}

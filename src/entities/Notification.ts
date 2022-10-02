import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Model from './Model';
import User from './User';

@Entity()
@ObjectType()
export class Notification extends Model {
  @Field()
  @Column()
  content: string;

  @Field()
  @ManyToOne(() => User)
  @JoinColumn()
  owner: User;

  @Field()
  @ManyToOne(() => User)
  @JoinColumn()
  requester: User;

  @Field()
  @Column()
  type: string;

  @Field()
  @Column({ default: false })
  read: boolean;
}

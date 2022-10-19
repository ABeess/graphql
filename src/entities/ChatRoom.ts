import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import Model from './Model';

@ObjectType()
@Entity()
export default class ChatRoom extends Model {
  @Field()
  @Column({ default: 'Private' })
  name: string;

  @Field()
  @Column({ enum: ['private', 'groups'], default: 'private' })
  type: string;
}

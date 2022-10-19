import { ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import Model from './Model';

@Entity()
@ObjectType()
export default class UserRoom extends Model {
  @Column()
  userId: string;
  @Column()
  room: string;
}

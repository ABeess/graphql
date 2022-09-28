import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import Model from './Model';
import User from './User';

@Entity()
@ObjectType()
export default class UserProfile extends Model {
  @Column()
  @Field()
  workAt: string;

  @Column()
  @Field()
  liveAt: string;

  @Column()
  @Field()
  form: string;

  @Column()
  @Field()
  address: string;

  @Column()
  @Field()
  gender: string;

  @Column()
  @Field()
  dayOfBirth: string;

  @Column()
  @Field()
  phoneNumber: string;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}

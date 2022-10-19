import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import Model from './Model';
import User from './User';

@Entity()
@ObjectType()
export default class UserProfile extends Model {
  @Column()
  @Field()
  liveAt: string;

  @Column()
  @Field()
  ward: string;

  @Column()
  @Field()
  province: string;

  @Column()
  @Field()
  district: string;

  @Column()
  @Field()
  gender: string;

  @Column()
  @Field()
  dayOfBirth: string;

  @Column()
  @Field()
  phoneNumber: string;

  @Column()
  @Field()
  story: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  thumbnail: string;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}

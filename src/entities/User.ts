import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import Comment from './Comment';
import Model from './Model';
import Post from './Post';
import UserProfile from './UserProfile';

@Entity('users')
@ObjectType()
export default class User extends Model {
  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Column()
  password: string;

  @Field({ nullable: true })
  @Column({ nullable: true, unique: true })
  googleId: string;

  @Field({ nullable: true })
  @Column({ nullable: true, unique: true })
  githubId: string;

  @Field({ nullable: true })
  @Column({ nullable: true, enum: ['local', 'google', 'github'] })
  provider: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatar: string;

  @Field(() => UserProfile)
  @OneToOne(() => UserProfile, (userProfile) => userProfile.user, {
    cascade: true,
  })
  profile?: UserProfile;

  @Field(() => [Post])
  @OneToMany(() => Post, (post) => post.user, { nullable: true })
  posts: Post[];

  @ManyToMany(() => Comment, (comment) => comment.user, { nullable: true })
  comment: Comment[];

  @ManyToMany(() => Comment, (comment) => comment.parent, { nullable: true })
  parent: Comment[];
}

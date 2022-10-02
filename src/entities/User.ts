import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import Comment from './Comment';
import Model from './Model';
import Post from './Post';
import PostLike from './PostLike';
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
  @Column({
    nullable: true,
    default: 'https://storage.googleapis.com/upload-file-c/06d76789329f40378962037b371373ca.jpg',
  })
  avatar: string;

  @Field(() => UserProfile, { nullable: true })
  @OneToOne(() => UserProfile, (userProfile) => userProfile.user, {
    cascade: true,
  })
  profile?: UserProfile;

  @Field(() => [Post])
  @OneToMany(() => Post, (post) => post.user, { nullable: true, cascade: true })
  posts: Post[];

  @Field(() => [PostLike])
  @OneToMany(() => PostLike, (postLike) => postLike.user, { nullable: true, cascade: true })
  postLike: PostLike[];

  @Field(() => Comment, { nullable: true })
  @OneToOne(() => Comment, (comment) => comment.author, { nullable: true, cascade: true })
  comment: Comment;
}

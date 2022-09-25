import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import Comment from './Comment';
import Image from './Image';
import Model from './Model';
import User from './User';

@ObjectType()
@Entity({ name: 'posts' })
export default class Post extends Model {
  @Field((_return) => [Image])
  @OneToMany(() => Image, (image) => image.post)
  image: Image[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts, { nullable: true })
  @JoinColumn()
  user: User;

  @Field()
  @Column()
  content: string;

  @Field()
  @Column({ nullable: true })
  caption: string;

  @Field()
  @Column({ enum: ['happy'], nullable: true })
  status: string;

  @Field()
  @Column({ nullable: true })
  checking: string;

  // Link
  @Field()
  @Column({ nullable: true })
  visible: string;

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.post)
  comment: Comment[];
}

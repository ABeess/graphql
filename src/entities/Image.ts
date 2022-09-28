import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Model from './Model';
import Post from './Post';

@Entity()
@ObjectType()
export default class Image extends Model {
  @Field()
  @Column()
  fileName: string;

  @Field()
  @Column()
  type: string;

  @Field()
  @Column()
  url: string;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.image, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  post: Post;
}

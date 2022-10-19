import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
export default class Model extends BaseEntity {
  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
  @PrimaryGeneratedColumn('uuid')
  id: string;
}

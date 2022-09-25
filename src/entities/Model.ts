import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
export default class Model extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Field()
  @CreateDateColumn()
  createdAt: string;

  @Field()
  @UpdateDateColumn()
  updatedAt: string;
}

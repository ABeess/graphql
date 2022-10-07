import { GraphQLJSONObject } from 'graphql-type-json';
import { Field, InputType } from 'type-graphql';
import User from '../entities/User';

@InputType()
export class UserInput {
  @Field(() => GraphQLJSONObject, { nullable: true })
  user?: User;
}

@InputType()
export class UserProfileInput {
  @Field()
  liveAt: string;

  @Field()
  ward: string;

  @Field()
  province: string;

  @Field()
  district: string;

  @Field()
  gender: string;

  @Field()
  dayOfBirth: string;

  @Field()
  phoneNumber: string;

  @Field()
  story: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  user?: User;
}

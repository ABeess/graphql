// import { Field, ObjectType } from 'type-graphql';
// import User from '../entities/User';
// import { BaseResponse } from './BaseResponse';

// @ObjectType({ implements: BaseResponse })
// export class UserResponse implements BaseResponse {
//   code: number;

//   message: string;

//   @Field(() => User, { nullable: true })
//   user?: Partial<User>;

//   @Field(() => String, { nullable: true })
//   accessToken?: string;
// }

// @ObjectType({ implements: BaseResponse })
// export class UserLogoutResponse implements BaseResponse {
//   code: number;

//   message: string;
// }

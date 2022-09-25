import argon2 from 'argon2';
import { verify } from 'jsonwebtoken';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { User } from '../entities';
import { LoginInput } from '../inputs/LoginInput';
import { RegisterInput } from '../inputs/RegisterInput';
import { Conflict, NotfoundError, UnauthorizedError } from '../lib/errorHandle';
import { Context, UseJWTPayload } from '../types';
import { UserResponse } from '../types/response';
import { generateToken } from '../utils/jwtManger';
import { generateError } from '../utils/responseError';

@Resolver()
export default class UserResolver {
  @Query(() => String)
  async users() {
    return 'abees';
  }

  @Mutation(() => UserResponse)
  async register(@Arg('registerInput') registerInput: RegisterInput): Promise<UserResponse> {
    try {
      const { email, password } = registerInput;

      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        throw new Conflict('Email already exists on the system');
      }
      const passwordHash = await argon2.hash(password);
      const newUser = User.create({
        ...registerInput,
        email,
        password: passwordHash,
      });
      await newUser.save();

      return {
        code: 201,
        message: 'Created a new user',
        user: newUser,
      };
    } catch (error) {
      return generateError(error);
    }
  }
  @Mutation(() => UserResponse)
  async login(
    @Arg('loginInput') { email, password }: LoginInput,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    try {
      const existingUser = await User.findOne({ where: { email } });

      console.log(existingUser);
      if (!existingUser) throw new NotfoundError('Email and password incorrect');

      const passwordValid = await argon2.verify(existingUser.password, password);

      if (!passwordValid) throw new NotfoundError('Email and password incorrect');

      const accessToken = generateToken({ data: { sub: existingUser.id }, form: 'accessToken' });
      const refreshToken = generateToken({ data: { sub: existingUser.id }, form: 'refreshToken' });

      req.session.userId = existingUser.id;
      req.session.refreshToken = refreshToken;

      return {
        code: 200,
        message: 'Login successfully',
        user: existingUser,
        accessToken,
      };
    } catch (error) {
      return generateError(error);
    }
  }

  @Query(() => UserResponse)
  async refreshToken(@Ctx() { req }: Context): Promise<UserResponse> {
    try {
      const authorization = req.header('Authorization');
      const accessToken = authorization && authorization.split(' ')[1];

      if (!accessToken) {
        throw new UnauthorizedError('You are not authenticated');
      }

      const payload = verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as UseJWTPayload;

      const newAccessToken = generateToken({
        data: {
          sub: payload?.sub as number,
        },
        form: 'accessToken',
      });

      const newRefreshToken = generateToken({
        data: {
          sub: payload.sub as number,
        },
        form: 'refreshToken',
      });

      req.session.refreshToken = newRefreshToken;

      return {
        code: 200,
        message: 'Refresh  accessToken',
        accessToken: newAccessToken,
      };
    } catch (error) {
      return generateError(error);
    }
  }
}

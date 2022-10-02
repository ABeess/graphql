import argon2 from 'argon2';
import { verify } from 'jsonwebtoken';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { User } from '../entities/index';
import { LoginInput } from '../inputs/LoginInput';
import { RegisterInput } from '../inputs/RegisterInput';
import { Conflict, NotfoundError, UnauthorizedError } from '../lib/errorHandle';
import { UserLogoutResponse, UserResponse } from '../response/UserResponse';
import { Context, UseJWTPayload } from '../types/index';
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

  @Mutation(() => UserResponse)
  async refreshToken(@Ctx() { req }: Context): Promise<UserResponse> {
    try {
      const refreshToken = req.session.refreshToken;

      if (!refreshToken) {
        throw new UnauthorizedError('You are not authenticated');
      }

      const payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as UseJWTPayload;

      if (!payload) {
        throw new UnauthorizedError('Token is not valid');
      }

      const existingUser = await User.findOneBy({
        id: payload.sub,
      });

      if (!existingUser) {
        throw new UnauthorizedError('You are not authenticated');
      }

      const newAccessToken = generateToken({
        data: {
          sub: payload?.sub as string,
        },
        form: 'accessToken',
      });

      const newRefreshToken = generateToken({
        data: {
          sub: payload.sub as string,
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
  @Mutation(() => UserLogoutResponse)
  async logout(@Ctx() { res, req }: Context): Promise<UserLogoutResponse> {
    try {
      res.clearCookie(process.env.SESSION_NAME);
      req.session.destroy((err) => {
        if (err) {
          throw new UnauthorizedError(err.message);
        }
      });
      return {
        code: 200,
        message: 'User logout',
      };
    } catch (error) {
      return generateError(error);
    }
  }
}

import { AuthenticationError } from 'apollo-server-core';
import { Secret, verify } from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';
import { Context, UseJWTPayload } from '../types/index';

export const authentication: MiddlewareFn<Context> = ({ context }, next) => {
  try {
    const authorization = context.req.header('Authorization');
    const accessToken = authorization && authorization.split(' ')[1];
    if (!accessToken) {
      throw new AuthenticationError('Not authenticated to perform request');
    }
    const payload = verify(accessToken, process.env.ACCESS_TOKEN_SECRET as Secret) as UseJWTPayload;

    context.user = payload;
    console.log('payload', payload);
    return next();
  } catch (error) {
    throw new AuthenticationError(`Error AuthenticationError: ${error}`);
  }
};

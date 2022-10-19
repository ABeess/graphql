import { AuthenticationError } from 'apollo-server-core';
import { Secret, verify } from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';
import { Context, UseJWTPayload } from '../types/index';

export const authentication: MiddlewareFn<Context> = ({ context }, next) => {
  try {
    const authorization = context.req.header('Authorization');
    const accessToken = authorization && authorization.split(' ')[1];

    if (!accessToken) {
      throw new Error('Not authenticated to perform request');
    }
    verify(accessToken, process.env.ACCESS_TOKEN_SECRET as Secret, (error, payload) => {
      if (error) {
        throw new AuthenticationError(error.message || 'Interval server');
      }
      context.user = payload as UseJWTPayload;
    });
    return next();
  } catch (error) {
    throw new AuthenticationError(`Error AuthenticationError: ${error}`);
  }
};

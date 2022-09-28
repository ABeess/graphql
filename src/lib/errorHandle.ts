import { ApolloError } from 'apollo-server-errors';
import { StatusCodes } from 'http-status-codes';

export class MyError extends Error {
  public static message = 'MyError';
  public readonly code = StatusCodes.BAD_REQUEST;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}

export class InternalServerRest extends MyError {
  public static message = 'InternalServerError';
  public static readonly code = StatusCodes.INTERNAL_SERVER_ERROR;
  constructor(message: string) {
    super(message, InternalServerRest.code);
  }
}

export class BadRequestRest extends MyError {
  public static message = 'BadRequestError';
  public static readonly code = StatusCodes.BAD_REQUEST;
  constructor(message: string) {
    super(message, BadRequestRest.code);
  }
}

export class UnauthorizedRest extends MyError {
  public static message = 'Unauthorized';
  public static readonly code = StatusCodes.UNAUTHORIZED;
  constructor(message: string) {
    super(message, UnauthorizedRest.code);
  }
}

export class Conflict extends ApolloError {
  constructor(message: string) {
    super(message, 'Conflict');
    Object.defineProperty(this, 'name', { value: 'CONFLICT_ERROR' });
  }
}

export class NotfoundError extends ApolloError {
  constructor(message: string) {
    super(message, 'Not Found');
    Object.defineProperty(this, 'name', { value: 'NOTFOUND_ERROR' });
  }
}

export class BadRequestError extends ApolloError {
  constructor(message: string) {
    super(message, 'Bad Request');
    Object.defineProperty(this, 'name', { value: 'BAD_REQUEST_ERROR' });
  }
}

export class ForbiddenError extends ApolloError {
  constructor(message: string) {
    super(message, 'Forbidden');
    Object.defineProperty(this, 'name', { value: 'FORBIDDEN_ERROR' });
  }
}

export class UnauthorizedError extends ApolloError {
  constructor(message: string) {
    super(message, 'Unauthorized');
    Object.defineProperty(this, 'name', { value: 'UNAUTHORIZED_ERROR' });
  }
}

export class TimeOutError extends ApolloError {
  constructor(message: string) {
    super(message, 'Request Timeout');
    Object.defineProperty(this, 'name', { value: 'TIMEOUT_ERROR' });
  }
}

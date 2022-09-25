import { ApolloError } from 'apollo-server-core';
import { getStatusCode } from 'http-status-codes';

interface ErrorResponse {
  code: number;
  message: string;
}

export const generateError = (error: ApolloError): ErrorResponse => {
  try {
    const codeString = error.extensions.code;
    return {
      code: getStatusCode(codeString),
      message: error.message || 'Interval server error' + error,
    };
  } catch (error) {
    return {
      code: 500,
      message: error.message || 'Interval server error' + error,
    };
  }
};

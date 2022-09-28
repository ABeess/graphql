import { isNumber } from 'lodash';
import { QueryInput } from '../inputs/QueryInput';

interface QueryResponse {
  page?: number;
  limit?: number;
  skip?: number;
}

export const queryGenerate = (query: QueryInput): QueryResponse => {
  if (!query) {
    return {
      page: 0,
      limit: 10,
      skip: 0,
    };
  }
  const page = query.page && isNumber(query.page) ? query.page : 0;
  const limit = isNumber(query.limit) ? query.limit : 5;
  const skip = page && isNumber(query.limit) ? query.limit * page : 0;

  return {
    page,
    limit,
    skip,
  };
};

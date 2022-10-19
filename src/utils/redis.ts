import Redis from 'ioredis';

// development
// export const redis = new Redis();

// production;
export const redis = new Redis({
  host: 'redis',
  port: 6379,
});

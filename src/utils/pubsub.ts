import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

// @ts-ignore
// pubsub.ee.setMaxListeners(30);

export { pubsub };

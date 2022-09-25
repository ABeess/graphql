FROM node:lts-alpine

WORKDIR /usr/src/graphql


COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .
COPY .env.production .env

RUN yarn build

ENV NODE_ENV production

EXPOSE 3089
CMD [ "node", "dist/index.js" ]
USER node
FROM node:lts as dependencies

WORKDIR /src/server
COPY package.json yarn.lock ./
RUN yarn  

FROM node:lts as builder

WORKDIR /src/server
COPY . /src/server
COPY --from=dependencies /src/server/node_modules ./node_modules
RUN yarn build 

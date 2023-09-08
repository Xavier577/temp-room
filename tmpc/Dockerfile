# stage one
FROM node:lts-alpine as builder

WORKDIR /usr/app

COPY package*.json ./

RUN yarn install

COPY --chown=node:node . .

RUN yarn build

RUN rm -rf node_modules

# stage two
FROM node:lts-alpine

USER node

WORKDIR /usr/app

COPY --from=builder /usr/app/package*.json ./

COPY --from=builder /usr/app/dist ./dist

RUN yarn install --production

COPY . .

EXPOSE 8080

CMD node dist/main.js











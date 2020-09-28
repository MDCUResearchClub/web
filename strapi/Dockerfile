FROM node:12

WORKDIR /mdcuresearchclub

COPY ./package.json ./yarn.lock ./

RUN yarn install

COPY . .

ENV NODE_ENV production

RUN yarn build

EXPOSE 1337

CMD ["yarn", "start"]
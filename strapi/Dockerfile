FROM node:12

WORKDIR /strapi

ENV NODE_ENV production

COPY ./package.json ./yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 1337

CMD ["yarn", "start"]

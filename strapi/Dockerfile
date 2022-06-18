FROM node:16

WORKDIR /strapi

ENV NODE_ENV production

COPY ./package.json ./package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 1337

CMD ["npm", "start"]

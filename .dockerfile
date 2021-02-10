FROM node:12-alpine
WORKDIR /app
ADD package.json /app/package.json
RUN yarn deploy
ADD . /app
EXPOSE 6550
CMD ["yarn", "start"]

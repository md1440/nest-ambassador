FROM node:17.8.0-alpine3.15

WORKDIR /app
# copy package.json to /app
COPY package.json .

RUN npm install
# copy all files to /app
COPY . .

CMD npm run start:dev

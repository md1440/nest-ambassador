FROM node:17.4

WORKDIR /app
# copy package.json to /app
COPY package.json .
RUN npm install
# copy all files to /app
COPY . .

CMD npm run start:dev

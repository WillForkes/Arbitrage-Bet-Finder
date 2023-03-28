FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./
COPY package.json ./
RUN npx prisma generate
RUN npm ci --only=production --quiet

COPY . .

ENV NODE_ENV production

EXPOSE 8080
CMD [ "node", "app.js" ]
USER node
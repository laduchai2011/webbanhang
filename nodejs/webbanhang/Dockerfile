# #syntax=docker/dockerfile:1

# FROM node:18-alpine
# ENV NODE_ENV=production

# WORKDIR /app

# COPY ["package.json", "package-lock.json*", "./"]

# RUN npm install --production

# COPY . .

# EXPOSE 4000

# CMD ["node", "index.js"]



FROM node:18-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

RUN npm run build:prod

RUN cp -a public prod-build-optimization

CMD ["node", "./prod-build-optimization/main.js"]
# CMD ["node", "index.js"]
# # syntax=docker/dockerfile:1

# FROM node:18-alpine
# ENV NODE_ENV=production

# WORKDIR /app

# COPY ["package.json", "package-lock.json*", "./"]

# RUN npm install --production

# COPY . .

# EXPOSE 3000

# CMD ["npm", "start"]


# build environment
FROM node:18-alpine as build

# Set env variable
# ARG REACT_APP_API_KEY
# ARG REACT_APP_CHATAPI_KEY
# ENV REACT_APP_API_KEY=$REACT_APP_API_KEY
# ENV REACT_APP_CHATAPI_KEY=$REACT_APP_CHATAPI_KEY

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

RUN npm run build

# production environment
FROM nginx
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
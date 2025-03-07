# syntax=docker/dockerfile:1
FROM node:alpine
WORKDIR /usr/src/app
ENV ACCESS_TOKEN_KEY=abc@123
ENV REFRESH_TOKEN_KEY=cba@123
ENV DB_CONNECTION=mongodb://mongo:27017/user
ENV CLOUDINARY_CLOUD_NAME=dp3z8bjnc
ENV CLOUDINARY_API_KEY=324676534195983
ENV CLOUDINARY_API_SECRET=1pzpeAYViBnjk2kQhydGBSeLnbg
# ENV FLASK_RUN_HOST=0.0.0.0
# RUN apk add --update npm
COPY package*.json ./
# RUN apt-get update && apt-get install -y curl
RUN npm install
COPY . .
EXPOSE 3000
EXPOSE 9229
CMD ["npm","run","dev"]
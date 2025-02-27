# syntax=docker/dockerfile:1
FROM node:alpine
WORKDIR /usr/src/app
# ENV FLASK_APP=app.py
# ENV FLASK_RUN_HOST=0.0.0.0
# RUN apk add --update npm
COPY package*.json ./
# RUN apt-get update && apt-get install -y curl
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
# STAGE 1
FROM node:20-alpine AS build

WORKDIR /app
COPY package.json ./
RUN yarn  install
COPY . /app
RUN yarn build
# STAGE 2
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
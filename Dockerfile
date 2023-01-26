FROM node:16.14.0
LABEL MAINTAINER "bugyaluwang@qq.com"
RUN mkdir -p /usr/sztunethelper-center
WORKDIR /usr/sztunethelper-center
COPY package.json /usr/sztunethelper-center
RUN npm i -g pnpm
RUN pnpm i
COPY . /usr/sztunethelper-center
CMD ["pnpm", "start"]
EXPOSE 3000
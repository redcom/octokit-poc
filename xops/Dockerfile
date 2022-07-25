# base image
FROM node:alpine as build
WORKDIR /usr/src/app

ENV JOBS max
ENV NPM_CONFIG_LOGLEVEL error
ENV NODE_OPTIONS --max-old-space-size=4096

COPY . ./

RUN yarn install \
      --silent \
      --network-concurrency 80 \
      && yarn build


# final image
FROM node:alpine

WORKDIR /usr/src/app

RUN mkdir -p /tmp/logs && chmod 777 /tmp/logs
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=build /usr/src/app/package.json /usr/src/app/
COPY --from=build /usr/src/app/dist /usr/src/app/dist
COPY --from=build /usr/src/app/ormconfig.ts /usr/src/app/

ENV PORT ${PORT}
ENV PATH "/usr/src/app/node_modules/.bin:${PATH}"

USER node

# start app

CMD yarn db:migrate:prod && yarn start

# expose port for other services to connect to
EXPOSE ${PORT}

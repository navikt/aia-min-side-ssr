FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24 as runtime

WORKDIR /usr/src/app

COPY ./dist ./dist
COPY ./node_modules ./node_modules
COPY ./storybook-static ./dist/client/storybook

ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["./dist/server/entry.mjs"]

EXPOSE $PORT


FROM node:24.11.1-bookworm-slim AS build_stage

WORKDIR /verbandbuch-ui

COPY . .

RUN npm ci
RUN npm run build

FROM node:24.11.1-bookworm-slim AS prod_stage

WORKDIR /verbandbuch-ui

COPY --from=build_stage /verbandbuch-ui/.ouput ./.ouput
COPY --from=build_stage /verbandbuch-ui/package*.json ./

RUN npm ci --only=prod --ignore-scripts

USER node

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

ENV TZ=Europe/Berlin

CMD ["node",".output/server/index.mjs"]
EXPOSE 3000




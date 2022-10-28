FROM node:16 AS build-env
WORKDIR /app

COPY . .
RUN npm cache clean --force
RUN npm install --unsafe-perm
RUN npx tsc -p tsconfig.build.json --sourceMap false --declaration false
RUN cp -r node_modules dist/node_modules
RUN cp ormconfig.js dist/ormconfig.js

FROM node:16
WORKDIR /app
COPY --from=build-env /app/dist .

EXPOSE 3000
ENTRYPOINT ["node", "main.js"]
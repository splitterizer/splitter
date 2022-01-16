FROM node:17.3.0-alpine3.15
WORKDIR /app
RUN addgroup app && adduser -S -G app app
ENV PORT=3000
ENV NODE_OPTIONS=--openssl-legacy-provider
EXPOSE 3000
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run testLinux
RUN npm run build
RUN rm -r src && rm -r tests && rm webpack.*.js && rm tsconfig.json && rm README.md
USER app
ENTRYPOINT ["npm","start"]
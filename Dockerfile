FROM node:17.3.0-alpine3.15
WORKDIR /app
COPY . .
RUN npm install
ENV PORT=3000
EXPOSE 3000
RUN addgroup app && adduser -S -G app app
USER app
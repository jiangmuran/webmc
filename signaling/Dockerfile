FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY signaling ./signaling
COPY tsconfig.json ./

ENV PORT=7777
EXPOSE 7777

CMD ["node", "--experimental-strip-types", "signaling/server.ts"]

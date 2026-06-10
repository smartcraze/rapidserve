FROM oven/bun:alpine

WORKDIR /app

COPY package.json bun.lock ./

COPY prisma ./prisma

RUN bun install

COPY . .

RUN bun run build

EXPOSE 9000

CMD ["bun", "dist/index.js"]
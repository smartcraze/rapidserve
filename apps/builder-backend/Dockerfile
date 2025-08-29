FROM oven/bun:slim

RUN apt-get update && \
    apt-get install -y curl git && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get upgrade -y

WORKDIR /home/app

COPY . .

RUN bun install && bun run build

RUN chmod +x main.sh && chmod +x dist/index.js

CMD ["/home/app/main.sh"]

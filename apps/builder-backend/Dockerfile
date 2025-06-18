FROM oven/bun:slim

RUN apt-get update && \
    apt-get install -y curl git && \
    apt-get upgrade -y

WORKDIR /home/app

COPY . .

RUN bun install && bun build index.ts --outfile ./dist/index.js

RUN chmod +x main.sh && chmod +x dist/index.js

CMD ["/home/app/main.sh"]

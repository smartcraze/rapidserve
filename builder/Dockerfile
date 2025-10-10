FROM ubuntu:focal

RUN apt-get update && \
    apt-get install -y curl git dos2unix && \
    curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get upgrade -y

WORKDIR /home/app

COPY package*.json tsconfig.json ./
RUN npm install

COPY main.sh main.sh
COPY index.ts index.ts

RUN dos2unix main.sh index.ts

RUN npm run build

RUN chmod +x main.sh
RUN chmod +x index.js

ENTRYPOINT ["/home/app/main.sh"]

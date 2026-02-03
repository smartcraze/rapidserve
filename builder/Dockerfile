FROM node:20

WORKDIR /home/app

# Install build dependencies
RUN apt-get update && apt-get install -y git dos2unix

COPY package*.json tsconfig.json ./
RUN npm install

COPY main.sh main.sh
COPY index.ts index.ts

RUN dos2unix main.sh index.ts

RUN npm run build

RUN chmod +x main.sh
RUN chmod +x index.js

ENTRYPOINT ["/home/app/main.sh"]

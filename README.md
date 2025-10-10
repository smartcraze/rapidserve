# Builder Server + Redis Deployment

This project is a **build and deployment server** that automatically builds your front-end project, uploads the build output to AWS S3, and publishes build logs to Redis. It runs inside Docker and is designed for **ephemeral, self-contained builds**.



## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Setup](#setup)
5. [Running the Containers](#running-the-containers)
6. [Environment Variables](#environment-variables)
7. [How it Works](#how-it-works)
8. [Stopping & Cleanup](#stopping--cleanup)
9. [Future Improvements](#future-improvements)



## Project Overview

The **Builder Server**:

* Clones the repository into `/home/app/output`
* Runs `npm install` and `npm run build`
* Uploads the `dist` folder contents to AWS S3
* Publishes build logs to Redis for real-time monitoring
* Runs in a self-contained Docker container

Redis and RedisInsight are included to allow **log monitoring**.


## Features

* Automatic build & deployment
* Real-time log publishing to Redis
* S3 upload with MIME type detection
* Works fully inside Docker
* Network-isolated setup for predictable behavior


## Prerequisites

* [Docker](https://www.docker.com/get-started) installed
* AWS credentials with S3 write access
* Redis and RedisInsight (managed via Docker in this setup)

---

## Setup

1. Clone this repository:

```bash
git clone <your-repo-url>
cd builder
```

2. Create the `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your own configuration (see [Environment Variables](#environment-variables)).

---

## Running the Containers

We recommend **isolating everything on a single Docker network**:

```bash
docker network create redis-net
```

Start Redis and RedisInsight:

```bash
docker compose -f docker-compose.redis.yml up -d
```

Build & run the builder server:

```bash
docker build -t build-server .
docker run --rm --env-file .env.local --network redis-net build-server
```

* `--rm` ensures the container is removed after it exits.
* Logs will appear in RedisInsight on port `5540`.

---

## Environment Variables

The builder server requires the following variables in `.env.local`:

```dotenv
# Redis
REDIS_URL=redis://redis:6379

# AWS S3
AWS_REGION=<your-region>
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
BUCKET_NAME=<your-s3-bucket>

# Project
PROJECT_ID=<unique-project-id>
```

**Note:** Use the **Redis service name** (`redis`) from the Docker network, not `localhost`.


## How it Works

1. Builder container clones the repo into `/home/app/output`.
2. Runs `npm install` → `npm run build`.
3. Recursively scans the `dist` folder.
4. Uploads all files to S3 with proper MIME types.
5. Publishes log events to Redis (`logs:<PROJECT_ID>`).
6. Disconnects from Redis and exits cleanly after the upload.


## Stopping & Cleanup

Stop Docker Compose services:

```bash
docker compose -f docker-compose.redis.yml down
```

Remove Docker network (optional):

```bash
docker network rm redis-net
```


## Future Improvements

* Support multiple build environments (e.g., React, Angular, Vue)
* Retry mechanism for failed S3 uploads
* Slack or email notifications for build completion/failures
* Persistent storage for builds to avoid repeated cloning

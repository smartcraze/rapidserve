# Rapid Serve

Rapid Serve is a Vercel-like deployment platform built from scratch. It allows users to deploy applications directly from a GitHub repository, with Docker-based builds, real-time build logs, and automatic hosting on custom subdomains.


### Architecture Diagram

<img width="2150" height="1261" alt="diagram-export-25-08-2025-22_54_43" src="https://github.com/user-attachments/assets/a74eb16b-2fa0-42bb-babe-c9363fb0b735" />

The system is composed of multiple services working together:
- **Next.js Frontend** – user interface for submitting GitHub URLs, monitoring builds, and viewing logs.
- **Builder Server** – fetches repo source, runs builds inside Docker containers on ECS, and uploads build outputs to S3.
- **Proxy Server** – maps unique slugs to subdomains and serves the final application via CloudFront.
- **WebSocket Server** – streams build logs from Redis pub/sub to the frontend in real time.
- **Redis** – pub/sub messaging for logs and build events.
- **Amazon ECS** – executes containerized builds.
- **Amazon S3 + CloudFront** – stores build artifacts and delivers them to end users.


## 🚀 Features
- **GitHub Integration** – paste a repo URL and trigger builds.
- **Docker Builds** – every project is built inside isolated ECS containers.
- **Real-Time Logs** – build logs are streamed to the frontend using WebSockets and Redis pub/sub.
- **Automatic Hosting** – each deployment gets a unique slug mapped to a subdomain.
- **Artifact Storage** – build outputs are stored in Amazon S3 and served through CloudFront CDN.

## ⚙️ Workflow

1. User submits a GitHub repo URL from the frontend.  
2. Builder Server spins up an ECS Docker container and starts the build.  
3. Build logs are published to Redis.  
4. WebSocket Server consumes the logs and streams them live to the frontend.  
5. Once the build completes, artifacts are uploaded to S3.  
6. Proxy Server maps the unique slug to a subdomain, pointing to CloudFront → S3.  
7. Users can now access the deployed app at its unique subdomain.  

## 📦 Tech Stack
- **Frontend:** Next.js  
- **Backend:** Node.js (Builder, Proxy, WebSocket servers)  
- **Containerization:** Docker + ECS  
- **Storage & Hosting:** AWS S3 + CloudFront  
- **Messaging:** Redis Pub/Sub  
- **Infrastructure:** AWS  

## 🔮 Future Improvements
- CI/CD integration for automatic redeploys on push.  
- Multi-region deployments.  
- Custom domain support.  
- Build caching for faster deployments.  

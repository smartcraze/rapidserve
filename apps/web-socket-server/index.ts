import { serve } from 'bun'
import Redis from 'ioredis'
import { ECSClient, RunTaskCommand } from '@aws-sdk/client-ecs'
import { generateSlug } from 'random-word-slugs'

const PORT = 9000
const SOCKET_PORT = 9002
const redis = new Redis(process.env.REDIS_URL || '')

const ecsClient = new ECSClient({
  region: process.env.AWS_REGION || '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
})

const config = {
  CLUSTER: process.env.ECS_CLUSTER || '',
  TASK: process.env.ECS_TASK || ''
}

const clients = new Map<WebSocket, string>()

const wsServer = serve({
  fetch(req, server) {
    if (server.upgrade(req)) {
      return undefined
    }
    return new Response('WebSocket Server Running', { status: 200 })
  },
  websocket: {
    open(ws) {
      console.log('Client connected')
    },
    message(ws, msg) {
      try {
        const parsed = JSON.parse(msg.toString())
        if (parsed.type === 'subscribe' && parsed.channel) {
          clients.set(ws as unknown as WebSocket, parsed.channel)
          ws.send(JSON.stringify({ type: 'info', msg: `Subscribed to ${parsed.channel}` }))
        }
      } catch {
        ws.send(JSON.stringify({ type: 'error', msg: 'Invalid message format' }))
      }
    },
    close(ws) {
      clients.delete(ws as unknown as WebSocket)
    }
  },
  port: SOCKET_PORT
})

console.log(`WebSocket server running on port ${SOCKET_PORT}`)

redis.psubscribe('logs:*')
redis.on('pmessage', (pattern, channel, message) => {
  for (const [ws, ch] of clients.entries()) {
    if (ch === channel && ws.readyState === ws.OPEN) {
      ws.send(message)
    }
  }
})

serve({
  port: PORT,
  async fetch(req) {
    if (req.method !== 'POST' || new URL(req.url).pathname !== '/project') {
      return new Response('Not found', { status: 404 })
    }

    const body = await req.json() as { gitURL: string, slug?: string }
    const gitURL = body.gitURL
    const slug = body.slug || generateSlug()

    const command = new RunTaskCommand({
      cluster: config.CLUSTER,
      taskDefinition: config.TASK,
      launchType: 'FARGATE',
      count: 1,
      networkConfiguration: {
        awsvpcConfiguration: {
          assignPublicIp: 'ENABLED',
          subnets: (process.env.SUBNETS || '').split(','),
          securityGroups: (process.env.SECURITY_GROUPS || '').split(',')
        }
      },
      overrides: {
        containerOverrides: [
          {
            name: 'builder-image',
            environment: [
              { name: 'GIT_REPOSITORY__URL', value: gitURL },
              { name: 'PROJECT_ID', value: slug }
            ]
          }
        ]
      }
    })

    await ecsClient.send(command)

    return Response.json({
      status: 'queued',
      data: { projectSlug: slug, url: `http://${slug}.localhost:8000` }
    })
  }
})

console.log(`REST API running on port ${PORT}`)
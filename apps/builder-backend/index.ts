import { exec } from 'child_process'
import path from 'path'
import fs from 'fs'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import mime from 'mime-types'
import Redis from 'ioredis'

const publisher = new Redis('your_redis_url')

const s3Client = new S3Client({
  region: 'your-region',
  credentials: {
    accessKeyId: 'your-access-key',
    secretAccessKey: 'your-secret-key',
  },
})

const PROJECT_ID = process.env.PROJECT_ID as string

function publishLog(log: string): void {
  publisher.publish(`logs:${PROJECT_ID}`, JSON.stringify({ log }))
}

async function init(): Promise<void> {
  console.log('Executing index.ts')
  publishLog('Build Started...')
  const outDirPath = path.join(__dirname, 'output')

  const p = exec(`cd ${outDirPath} && npm install && npm run build`)

  p.stdout?.on('data', (data: string | Buffer) => {
    const log = data.toString()
    console.log(log)
    publishLog(log)
  })

  p.stderr?.on('data', (data: string | Buffer) => {
    const errorLog = data.toString()
    console.log('Error', errorLog)
    publishLog(`error: ${errorLog}`)
  })

  p.on('close', async () => {
    console.log('Build Complete')
    publishLog('Build Complete')

    const distFolderPath = path.join(__dirname, 'output', 'dist')

    let distFolderContents: string[]
    try {
      distFolderContents = fs.readdirSync(distFolderPath, { recursive: true }) as string[]
    } catch (err) {
      console.error('Dist folder not found')
      publishLog('Dist folder not found')
      return
    }

    publishLog('Starting to upload')

    for (const file of distFolderContents) {
      const filePath = path.join(distFolderPath, file)
      if (fs.lstatSync(filePath).isDirectory()) continue

      console.log('Uploading', filePath)
      publishLog(`uploading ${file}`)

      const command = new PutObjectCommand({
        Bucket: 'rapid-serve-outputs',
        Key: `__outputs/${PROJECT_ID}/${file}`,
        Body: fs.createReadStream(filePath),
        ContentType: mime.lookup(filePath) || 'application/octet-stream',
      })

      await s3Client.send(command)

      publishLog(`uploaded ${file}`)
      console.log('uploaded', filePath)
    }

    publishLog('Done')
    console.log('Done...')
  })
}

init().catch((err) => {
  console.error('Fatal error', err)
  publishLog(`Fatal error: ${err.message}`)
})

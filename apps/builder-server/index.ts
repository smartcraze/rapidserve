import { exec } from 'child_process'
import path from 'path'
import fs from 'fs'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import mime from 'mime-types'

require('dotenv').config()

const s3Client = new S3Client({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
})

const PROJECT_ID = process.env.PROJECT_ID as string

async function init(): Promise<void> {
  console.log('Executing index.ts')
  const outDirPath = path.join(__dirname, 'output')
  // check if i have  to use the npm or bun
  const p = exec(`cd ${outDirPath} && npm install && npm run build`)

  p.stdout?.on('data', (data: string | Buffer) => {
    const log = data.toString()
    console.log(log)
  })

  p.stderr?.on('data', (data: string | Buffer) => {
    const errorLog = data.toString()
    console.log('Error', errorLog)
  })

  p.on('close', async () => {
    console.log('Build Complete')

    const distFolderPath = path.join(__dirname, 'output', 'dist')

    let distFolderContents: string[]
    try {
      distFolderContents = fs.readdirSync(distFolderPath, {
        recursive: true,
      }) as string[]
    } catch (err) {
      console.error('Dist folder not found')
      return
    }

    for (const file of distFolderContents) {
      const filePath = path.join(distFolderPath, file)
      if (fs.lstatSync(filePath).isDirectory()) continue

      console.log('Uploading', filePath)

      const command = new PutObjectCommand({
        Bucket: 'rapid-serve-outputs',
        Key: `__outputs/${PROJECT_ID}/${file}`,
        Body: fs.createReadStream(filePath),
        ContentType: mime.lookup(filePath) || 'application/octet-stream',
      })

      await s3Client.send(command)

      console.log('uploaded', filePath)
    }

    console.log('Done...')
  })
}

init().catch((err) => {
  console.error('Fatal error', err)
})

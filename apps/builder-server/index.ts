import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import mime from 'mime-types'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const PROJECT_ID = process.env.PROJECT_ID
if (!PROJECT_ID) throw new Error('PROJECT_ID not set in environment')

const s3Client = new S3Client({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const OUTPUT_DIR = path.resolve(__dirname, '../output')
const DIST_DIR = path.join(OUTPUT_DIR, 'dist')

async function runBuild(): Promise<void> {
  return new Promise((resolve, reject) => {
    const build = exec(`cd ${OUTPUT_DIR} && npm install && npm run build`, { shell: '/bin/bash' })

    build.stdout?.on('data', (data) => process.stdout.write(data.toString()))
    build.stderr?.on('data', (data) => process.stderr.write(data.toString()))

    build.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`Build failed with code ${code}`))
    })
  })
}

async function uploadDistToS3(): Promise<void> {
  if (!fs.existsSync(DIST_DIR)) throw new Error('Dist folder does not exist')

  const files = fs.readdirSync(DIST_DIR, { withFileTypes: true })

  for (const file of files) {
    if (file.isDirectory()) continue
    const filePath = path.join(DIST_DIR, file.name)

    const command = new PutObjectCommand({
      Bucket: 'rapid-serve-outputs',
      Key: `__outputs/${PROJECT_ID}/${file.name}`,
      Body: fs.createReadStream(filePath),
      ContentType: mime.lookup(filePath) || 'application/octet-stream',
    })

    await s3Client.send(command)
    console.log('Uploaded:', file.name)
  }
}

async function main() {
  console.log('Starting build & upload process...')
  await runBuild()
  console.log('Build complete, uploading to S3...')
  await uploadDistToS3()
  console.log('All done!')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})

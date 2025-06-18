import { serve } from 'bun'

const PORT = 8000
const BASE_PATH = 'https://vercel-clone-outputs.s3.ap-south-1.amazonaws.com/__outputs'

console.log(`Reverse Proxy Running..${PORT}`)

serve({
  port: PORT,
  async fetch(req: Request) {
    const url = new URL(req.url)
    const hostname = req.headers.get("host") || ''
    const subdomain = hostname.split('.')[0]

    // Construct the new target URL
    const path = url.pathname === '/' ? '/index.html' : url.pathname
    const targetURL = `${BASE_PATH}/${subdomain}${path}`

    const response = await fetch(targetURL, {
      method: req.method,
      headers: req.headers,
      body: req.body,
    })

    return response
  }
})

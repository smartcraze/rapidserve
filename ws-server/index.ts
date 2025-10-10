import { serve } from "bun";
import { generateSlug } from "random-word-slugs";
import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import Redis from "ioredis";

const PORT = 9000;

const ecsClient = new ECSClient({
  region: 'ap-south-1', 
  credentials: {
    accessKeyId: "", 
    secretAccessKey: "", 
  },
});

const config = {
  CLUSTER: "",
  TASK: "",
};

const subscriber = new Redis(process.env.REDIS_URL!);
const channels: Record<string, Set<import("bun").ServerWebSocket<any>>> = {};

// Store WebSocket data
const wsData = new WeakMap<import("bun").ServerWebSocket<any>, { joinedChannels: string[] }>();

subscriber.psubscribe("logs:*");

subscriber.on("pmessage", (pattern, channel, message) => {
  if (channels[channel]) {
    for (const ws of channels[channel]) {
      ws.send(message);
    }
  }
});

serve({
  port: PORT,
  fetch(req, server) {
    const url = new URL(req.url);
    
    // Handle WebSocket upgrade
    if (req.headers.get("upgrade") === "websocket") {
      const success = server.upgrade(req);
      if (success) {
        return; // do not return a Response
      }
      return new Response("Upgrade failed", { status: 500 });
    }

    // Handle HTTP requests
    if (req.method === "POST" && url.pathname === "/project") {
      return handleProjectCreation(req);
    }

    if (url.pathname === "/") {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>WebSocket Test</title>
        </head>
        <body>
          <h1>WebSocket Server Running</h1>
          <div id="messages"></div>
          <input type="text" id="channelInput" placeholder="Enter channel name" />
          <button onclick="subscribe()">Subscribe</button>
          <script>
            const ws = new WebSocket('ws://localhost:${PORT}');
            const messages = document.getElementById('messages');
            
            ws.onopen = () => {
              messages.innerHTML += '<p>Connected to WebSocket</p>';
            };
            
            ws.onmessage = (event) => {
              messages.innerHTML += '<p>Received: ' + event.data + '</p>';
            };
            
            function subscribe() {
              const channel = document.getElementById('channelInput').value;
              if (channel) {
                ws.send(JSON.stringify({ action: 'subscribe', channel: channel }));
              }
            }
          </script>
        </body>
        </html>
      `, {
        headers: { "Content-Type": "text/html" }
      });
    }

    return new Response("Not Found", { status: 404 });
  },
  websocket: {
    open(ws) {
      console.log("WebSocket connection opened");
      wsData.set(ws, { joinedChannels: [] });
    },

    message(ws, message) {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.action === "subscribe" && data.channel) {
          const channel = data.channel;
          const clientData = wsData.get(ws);
          
          if (clientData) {
            clientData.joinedChannels.push(channel);
            
            if (!channels[channel]) {
              channels[channel] = new Set();
            }
            channels[channel].add(ws);
            
            ws.send(JSON.stringify({ message: `Joined ${channel}` }));
            console.log(`Client subscribed to channel: ${channel}`);
          }
        }
      } catch (error) {
        console.error("Error parsing message:", error);
        ws.send(JSON.stringify({ error: "Invalid message format" }));
      }
    },

    close(ws, code, message) {
      console.log(`WebSocket connection closed with code: ${code}`);
      const clientData = wsData.get(ws);
      
      if (clientData) {
        // Remove the WebSocket from all channels it joined
        for (const channel of clientData.joinedChannels) {
          channels[channel]?.delete(ws);
          
          if (channels[channel]?.size === 0) {
            delete channels[channel];
          }
        }
        
        wsData.delete(ws);
      }
    },

    drain(ws) {
      console.log("WebSocket is ready to receive more data");
    },
  },
});

async function handleProjectCreation(req: Request) {
  try {
    const body = await req.json() as { gitURL?: string; slug?: string };
    const { gitURL, slug } = body;
    const projectSlug = slug || generateSlug();

    const command = new RunTaskCommand({
      cluster: config.CLUSTER,
      taskDefinition: config.TASK,
      launchType: "FARGATE",
      count: 1,
      networkConfiguration: {
        awsvpcConfiguration: {
          assignPublicIp: "ENABLED",
          subnets: ["", "", ""], 
          securityGroups: [""],
        },
      },
      overrides: {
        containerOverrides: [
          {
            name: "builder-image",
            environment: [
              { name: "GIT_REPOSITORY__URL", value: gitURL },
              { name: "PROJECT_ID", value: projectSlug },
            ],
          },
        ],
      },
    });

    await ecsClient.send(command);

    return new Response(
      JSON.stringify({
        status: "queued",
        data: {
          projectSlug,
          url: `http://${projectSlug}.localhost:8000`,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

console.log(`🚀 Server running on http://localhost:${PORT}`);
console.log(`📡 WebSocket server ready on ws://localhost:${PORT}`);

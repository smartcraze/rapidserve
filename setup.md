

cd proxy-server
pm2 start --interpreter ~/.bun/bin/bun index.ts --name proxy



sudo nano /etc/caddy/Caddyfile

{
    email hello@surajv.dev
}

# Wildcard proxy deployments
*.proxy.surajv.dev {
    reverse_proxy localhost:8000
}

# Main API
rapidserveapi.surajv.dev {
    reverse_proxy localhost:9000
}

# Websocket server
rapidservews.surajv.dev {
    reverse_proxy localhost:9002
}




sudo systemctl reload caddy
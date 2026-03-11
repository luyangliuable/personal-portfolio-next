# Deployment Guide for llcode.tech

## Quick Start

### 1. Start Backend First (Required for Build)
```bash
cd ~/projects/api_fastapi
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 2. Build Frontend
```bash
cd ~/projects/personal-portfolio-next
npm run build
```

### 3. Start Frontend
```bash
npm start
```

### 4. Start Cloudflare Tunnel
```bash
cloudflared tunnel run llcode-tunnel
```

---

## Multi-Laptop Setup

### Copy to New Laptop
```bash
# Copy repos
scp -r ~/projects/personal-portfolio-next user@new-laptop:~/projects/
scp -r ~/projects/api_fastapi user@new-laptop:~/projects/

# Copy cloudflare credentials
scp ~/.cloudflared/*.json user@new-laptop:~/.cloudflared/
scp ~/.cloudflared/config.yml user@new-laptop:~/.cloudflared/
```

### Setup Script (`~/setup-llcode.sh`)
```bash
#!/bin/bash
brew install node npm cloudflared python3

cd ~/projects/api_fastapi
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cd ~/projects/personal-portfolio-next
npm install
```

### Startup Scripts

**`~/start-backend.sh`**:
```bash
#!/bin/bash
cd ~/projects/api_fastapi
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000
```

**`~/start-frontend.sh`**:
```bash
#!/bin/bash
cd ~/projects/personal-portfolio-next
npm start
```

**`~/start-tunnel.sh`**:
```bash
#!/bin/bash
cloudflared tunnel run llcode-tunnel
```

**`~/start-all.sh`** (One command):
```bash
#!/bin/bash
pkill -f "uvicorn|next start|cloudflared" 2>/dev/null || true
sleep 2

~/start-backend.sh &
until curl -s http://localhost:8000/health >/dev/null; do sleep 1; done

cd ~/projects/personal-portfolio-next
npm run build
npm start &
sleep 5

cloudflared tunnel run llcode-tunnel &
wait
```

Make executable:
```bash
chmod +x ~/*.sh
```

---

## Cloudflare Tunnel Config

`~/.cloudflared/config.yml`:
```yaml
tunnel: YOUR-TUNNEL-ID
credentials-file: /Users/USERNAME/.cloudflared/YOUR-TUNNEL-ID.json

ingress:
  - hostname: llcode.tech
    path: /api/*
    service: http://localhost:8000
  - hostname: llcode.tech
    path: /image/*
    service: http://localhost:8000
  - hostname: llcode.tech
    service: http://localhost:3000
  - service: http_status:404
```

---

## Troubleshooting

**Build fails with HTML error:**
- Backend must be running during build
- Check: `curl http://localhost:8000/health`

**Phone shows old site:**
- Purge Cloudflare cache in dashboard
- Hard refresh: `llcode.tech?v=2`

**Images not loading:**
- Check tunnel config includes `/image/*` route
- Verify backend has images: `curl http://localhost:8000/image/YOUR-ID`

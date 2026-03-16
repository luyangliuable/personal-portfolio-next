# Deployment Scripts

This folder contains launchd plist files for auto-starting the backend and frontend services on macOS.

## Files

- `com.llcode.backend.plist` - Launchd configuration for the Rust backend server
- `com.llcode.frontend.plist` - Launchd configuration for the Next.js frontend dev server
- `com.llcode.cloudflare.plist` - Launchd configuration for Cloudflare tunnel (public access)

## Prerequisites

1. **Backend binary must be built:**

    ```bash
    cd /Users/blackfish/personal-portfolio/server
    cargo build --release
    ```

2. **Frontend dependencies must be installed:**

    ```bash
    cd /Users/blackfish/personal-portfolio-next
    npm install
    ```

3. **Logs directory:**
    ```bash
    mkdir -p ~/Library/Logs
    ```

## Setup

The plist files are symlinked from `~/Library/LaunchAgents/`. To load the services:

```bash
# Load and start all services
launchctl load ~/Library/LaunchAgents/com.llcode.backend.plist
launchctl load ~/Library/LaunchAgents/com.llcode.frontend.plist
launchctl load ~/Library/LaunchAgents/com.llcode.cloudflare.plist
```

## Verification

Check if services are running:

```bash
# List loaded services
launchctl list | grep com.llcode

# Check logs
 tail -f ~/Library/Logs/com.llcode.backend.out.log
 tail -f ~/Library/Logs/com.llcode.frontend.out.log
 tail -f ~/Library/Logs/com.llcode.cloudflare.out.log
```

## Unloading

To stop and unload the services:

```bash
launchctl unload ~/Library/LaunchAgents/com.llcode.backend.plist
launchctl unload ~/Library/LaunchAgents/com.llcode.frontend.plist
launchctl unload ~/Library/LaunchAgents/com.llcode.cloudflare.plist
```

## Configuration Details

### Backend Plist

- **Program:** `/Users/blackfish/personal-portfolio/server/target/release/server`
- **Working Directory:** `/Users/blackfish/personal-portfolio/server`
- **KeepAlive:** true (restarts if crashes)
- **RunAtLoad:** true (starts on boot/login)

### Frontend Plist

- **Program:** `/Users/blackfish/.nvm/versions/node/v21.1.0/bin/npm`
- **Arguments:** `start`
- **Working Directory:** `/Users/blackfish/personal-portfolio-next`
- **Environment:** PATH includes Node and Homebrew binaries
- **KeepAlive:** true
- **RunAtLoad:** true

### Cloudflare Tunnel Plist

- **Program:** `/opt/homebrew/bin/cloudflared`
- **Arguments:** `tunnel run llcode-tech-home`
- **KeepAlive:** true (restarts if crashes)
- **RunAtLoad:** true (starts on boot/login)
- **Requires:** Cloudflare tunnel `llcode-tech-home` must be configured via `cloudflared tunnel login`

## Troubleshooting

1. **Permission issues:** Ensure the plist files have correct permissions:

    ```bash
    chmod 644 ~/Library/LaunchAgents/com.llcode.*.plist
    ```

2. **Binary not found:** Verify the paths in the plist files match your actual file locations.

3. **Port conflicts:** Make sure ports 3000 (frontend) and 8000 (backend) are not in use by other processes.

4. **Check system logs:**
    ```bash
    log show --predicate 'process == "launchd"' --last 1h | grep com.llcode
    ```

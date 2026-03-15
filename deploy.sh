#!/bin/bash

# Deployment script for llcode.tech

echo "Starting deployment..."

# Build the application
echo "Building Next.js application..."
npm run build

if [ $? -ne 0 ]; then
    echo "Build failed! Aborting deployment."
    exit 1
fi

# Optional: Copy to deployment directory (adjust path as needed)
# cp -r .next /var/www/llcode.tech/

# Optional: Purge Cloudflare cache (requires API token)
# curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
#      -H "Authorization: Bearer YOUR_API_TOKEN" \
#      -H "Content-Type: application/json" \
#      --data '{"purge_everything":true}'

echo "Build complete!"
echo ""
echo "Next steps:"
echo "1. Ensure the build files are served from: $(pwd)/.next"
echo "2. Restart your web server if needed"
echo "3. Clear browser cache with Cmd+Shift+R (Mac) or Ctrl+F5 (Windows)"
echo "4. If using Cloudflare, purge cache from the dashboard"

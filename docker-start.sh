#!/bin/sh

# Start Socket.IO server in the background
echo "Starting Socket.IO server on port 3001..."
node server/socket-server.mjs &

# Wait a moment for the Socket.IO server to start
sleep 2

# Start Next.js server
echo "Starting Next.js server on port 3000..."
node server.js

# Keep the container running
wait

# Docker Setup for Technical Interview Feedback App

This document explains how to run the Technical Interview Feedback application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, for easier management)

## Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and start the application
npm run docker:compose

# Stop the application
npm run docker:compose:down
```

### Option 2: Using Docker directly

```bash
# Build the Docker image
npm run docker:build

# Run the container
npm run docker:run
```

### Option 3: Manual Docker commands

```bash
# Build the image
docker build -t matrix-app .

# Run the container
docker run -p 3000:3000 -p 3001:3001 matrix-app
```

## Accessing the Application

Once the container is running, you can access:

- **Frontend**: http://localhost:3000
- **Socket.IO Server**: http://localhost:3001
- **API Endpoints**:
  - `GET http://localhost:3001/active-sessions` - List active sessions
  - `POST http://localhost:3001/terminate-session/{sessionId}` - Terminate a session
  - `GET http://localhost:3001/session-stats` - Get session statistics

## Container Architecture

The Docker container runs both services:

1. **Next.js Frontend** (Port 3000)
   - Serves the React application
   - Handles routing and static assets
   - Built with standalone output for optimal Docker performance

2. **Socket.IO Server** (Port 3001)
   - Manages real-time collaboration
   - Handles session management
   - Provides REST API endpoints

## Environment Variables

The following environment variables can be configured:

- `NODE_ENV`: Set to `production` (default)
- `PORT`: Socket.IO server port (default: 3001)

Example with custom port:
```bash
docker run -p 3000:3000 -p 3002:3002 -e PORT=3002 matrix-app
```

## Health Checks

The container includes health checks that verify:
- Frontend is accessible on port 3000
- Checks every 30 seconds
- 10-second timeout
- 3 retry attempts
- 40-second start period

## Troubleshooting

### Port Conflicts
If ports 3000 or 3001 are already in use:
```bash
docker run -p 3002:3000 -p 3003:3001 matrix-app
```

### Container Logs
View container logs:
```bash
docker logs <container-id>
```

### Container Shell Access
Access the container shell:
```bash
docker exec -it <container-id> /bin/sh
```

### Rebuild After Changes
If you make changes to the code:
```bash
docker-compose up --build
```

## Production Deployment

For production deployment:

1. **Use a reverse proxy** (nginx, traefik) for SSL termination
2. **Set up environment variables** for production settings
3. **Configure logging** for monitoring
4. **Set up health checks** for container orchestration
5. **Use Docker secrets** for sensitive data

Example production docker-compose.yml:
```yaml
version: '3.8'
services:
  matrix-app:
    build: .
    ports:
      - "3000:3000"
      - "3001:3001"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## Development vs Production

- **Development**: Use `npm run dev` and `npm run socket-server` for hot reloading
- **Production**: Use Docker for consistent, isolated deployment

## File Structure

```
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # Docker Compose configuration
├── docker-start.sh         # Startup script for both servers
├── .dockerignore           # Files to exclude from Docker build
└── next.config.ts         # Next.js config with standalone output
```

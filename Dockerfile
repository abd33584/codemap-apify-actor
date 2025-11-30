# Use official Node.js image (Debian-based) instead of Alpine for glibc compatibility
FROM node:16-bullseye-slim

# Install git (needed for cloning repositories)
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . ./

# Set binary permissions (binary is committed to repo)
RUN chmod 755 binaries/codemap-linux && ls -la binaries/

# Run as non-root user
USER node

# Set the command to run the actor
CMD ["npm", "start"]

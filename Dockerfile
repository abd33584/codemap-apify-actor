# Use Apify's base image with Node.js
FROM apify/actor-node:16

# Switch to root user to install packages
USER root

# Install curl, unzip, and git using apk (Alpine Linux package manager)
RUN apk add --no-cache curl unzip git

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . ./

# Set binary permissions (binary is committed to repo)
RUN chmod 755 binaries/codemap-linux \
    && chown -R node:node binaries \
    && ls -la binaries/

# Switch back to default node user (standard in Node.js images)
USER node

# Set the command to run the actor
CMD ["npm", "start"]

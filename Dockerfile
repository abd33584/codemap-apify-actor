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

# Create binaries directory and download codemap binary
RUN mkdir -p binaries \
    && cd binaries \
    && echo "Downloading codemap binary..." \
    && wget --no-check-certificate -O codemap-linux https://github.com/JordanCoin/codemap/releases/download/v2.4/codemap-linux-amd64 \
    && echo "Download complete. File info:" \
    && file codemap-linux || echo "file command not available" \
    && ls -lh codemap-linux \
    && chmod 755 codemap-linux \
    && ls -la \
    && cd .. \
    && chown -R node:node binaries

# Switch back to default node user (standard in Node.js images)
USER node

# Set the command to run the actor
CMD ["npm", "start"]

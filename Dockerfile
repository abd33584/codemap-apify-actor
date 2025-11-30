# Use Apify's base image with Node.js
FROM apify/actor-node:16

# Switch to root user to install packages
USER root

# Install curl and unzip using apk (Alpine Linux package manager)
RUN apk add --no-cache curl unzip

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . ./

# Create binaries directory and download codemap binary
RUN mkdir -p binaries \
    && wget -O codemap-linux.tar.gz https://github.com/JordanCoin/codemap/releases/download/v2.4/codemap-linux-amd64.tar.gz \
    && tar -xzf codemap-linux.tar.gz \
    && find . -name "codemap" -type f -executable -exec mv {} binaries/codemap-linux \; \
    && chmod +x binaries/codemap-linux \
    && rm -rf codemap-linux.tar.gz codemap-linux-amd64

# Switch back to default node user (standard in Node.js images)
USER node

# Set the command to run the actor
CMD ["npm", "start"]

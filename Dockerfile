# Use Apify's base image with Node.js
FROM apify/actor-node:16

# Install curl and unzip
RUN apt-get update && apt-get install -y curl unzip && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . ./

# Copy codemap binary for Linux (Apify runs on Linux)
RUN mkdir -p binaries

# Download codemap Linux binary
RUN curl -L -o codemap-linux.zip https://github.com/JordanCoin/codemap/releases/download/v2.4/codemap-linux-amd64.zip \
    && unzip codemap-linux.zip -d /tmp/codemap \
    && mv /tmp/codemap/codemap-linux-amd64/codemap binaries/codemap-linux \
    && chmod +x binaries/codemap-linux \
    && rm -rf /tmp/codemap codemap-linux.zip

# Set the command to run the actor
CMD ["npm", "start"]

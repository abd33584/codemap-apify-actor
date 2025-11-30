# Use Apify's base image with Node.js
FROM apify/actor-node:16

# Switch to root user to install packages
USER root

# Install curl, unzip, git, and glibc compatibility for Alpine
RUN apk add --no-cache curl unzip git libc6-compat \
    && wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub \
    && wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.35-r1/glibc-2.35-r1.apk \
    && wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.35-r1/glibc-bin-2.35-r1.apk \
    && apk add --no-cache --force-overwrite glibc-2.35-r1.apk glibc-bin-2.35-r1.apk \
    && rm glibc-2.35-r1.apk glibc-bin-2.35-r1.apk

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

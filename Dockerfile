#  Node.js 18  base image
FROM node:18-alpine

# health check
RUN apk add --no-cache curl

#  working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

#  dependencies
RUN npm install

# Copy source code
COPY . .

# Build Angular application
RUN npm start

# Expose  port 4200
EXPOSE 4200

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:4200/api/cards || exit 1

#  Express server 
CMD ["node", "src/server/server.js"]
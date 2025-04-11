FROM node:18-alpine AS build

# Install dependencies for bcrypt compilation
RUN apk add --no-cache python3 make g++

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --force

# Copy application source
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Set NODE_ENV
ENV NODE_ENV=production

# Install packages needed for bcrypt and other native modules
RUN apk add --no-cache make g++

# Create app directory
WORKDIR /usr/src/app

# Copy built application from build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./

# Expose API port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]

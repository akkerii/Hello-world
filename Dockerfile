# Use the official Node.js runtime as the base image
FROM node:18-alpine AS base

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY app/package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Create a non-root user to run the application
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy the application code
COPY app/ .

# Change ownership of the app directory to the nodejs user
RUN chown -R nextjs:nodejs /usr/src/app
USER nextjs

# Expose the port that the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["node", "server.js"]
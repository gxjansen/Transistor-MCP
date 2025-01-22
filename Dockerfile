# Use an official Node.js image as the base image
FROM node:20 AS builder

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Build the TypeScript code
RUN npm run build

# Use a smaller Node.js image for the production environment
FROM node:20-slim AS production

# Set the working directory
WORKDIR /app

# Copy the built files and necessary files from the builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

# Set environment variables (if needed)
ENV TRANSISTOR_API_KEY=your-api-key-here

# Command to run the application
ENTRYPOINT ["node", "build/index.js"]
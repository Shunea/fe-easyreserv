ARG RUN_IMG=node:18.16-alpine
ARG BUILD_IMG=node:18.16-alpine

# Stage 1: Build the React app
FROM $BUILD_IMG AS builder

WORKDIR /app

# Copy package.json to the working directory
COPY package*.json ./

# Install dependencies using npm
RUN npm cache clean --force
RUN npm install --legacy-peer-deps

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app for production
RUN npm run build

# Stage 2: Create the production image
FROM $RUN_IMG

# Set timezone
RUN apk add --no-cache tzdata
ENV TZ=Europe/Chisinau

# Create a non-root user (here, we name it "appuser")
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set the working directory in the container
WORKDIR /app

# Copy the built artifacts from the previous stage (builder)
COPY --chown=appuser:appgroup --from=builder /app/build ./build

# Install a lightweight web server (optional - you can use any server you prefer)
RUN npm install -g serve

# Expose the port your React app will listen on (adjust if your app uses a different port)
EXPOSE 3000

# Switch to the non-root user before running the application
USER appuser

# Start the web server when the container starts
CMD ["serve", "-s", "build", "-l", "3000"]

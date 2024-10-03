
# Build the Docker image

#docker build -t react-native-app .

# Description: Dockerfile for the React Native application

# Use the official Node.js 20 image

FROM node:20

# Set the working directory

WORKDIR /app

# Copy the package.json and package-lock.json files

COPY package*.json ./

# Install the dependencies

RUN npm install

# Copy the source code

COPY . .

# Expose the port

EXPOSE 3000

# Start the application

CMD ["npm", "start"]




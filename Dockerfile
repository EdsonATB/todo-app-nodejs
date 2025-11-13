# Use an official noje.js runtime as a parent image
FROM node:22-alpine


# Set the working directory in the container
WORKDIR /app

# Copy the package.json and the package-lock.json to the container
COPY package*.json .

# Install the dependencies 
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the PORT that the app runs on
EXPOSE 5003

# Define the command to run the application
RUN npx prisma generate

CMD ["node", "./src/server.js"]
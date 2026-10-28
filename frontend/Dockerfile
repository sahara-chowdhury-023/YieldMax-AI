
# Node.js environment
FROM node:22-alpine

# Working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy React project
COPY . .

# Vite port
EXPOSE 5173

# Start React development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
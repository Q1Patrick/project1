# Dockerfile cho Frontend - Chạy từ thư mục gốc project
FROM node:20-alpine

WORKDIR /app

# Copy package files từ frontend-web
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source
COPY . .

# Expose port
EXPOSE 5173

# Development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

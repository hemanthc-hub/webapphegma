# FROM node:18.6.0

# WORKDIR /usr/src/app

# ADD package.json package.json

# ENV NODE_OPTIONS=--max-old-space-size=8192

# COPY . . 

# RUN npm install --legacy-peer-deps

# CMD npm start 0.0.0.0

# EXPOSE 3000

# Stage 1: Build the React Application
FROM node:25-alpine as build
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the code and run the production build
COPY . .
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:alpine

# Copy the built production files from Stage 1
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Overwrite default Nginx config to support React Router (SPA fallback)
# and listen on port 3000 to match your AWS bindings
RUN echo 'server { \
    listen       3000; \
    server_name  localhost; \
    location / { \
    root   /usr/share/nginx/html; \
    index  index.html index.htm; \
    try_files $uri $uri/ /index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf

# Expose port 3000
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
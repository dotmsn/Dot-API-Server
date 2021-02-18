#!/bin/sh
APP_NAME="dot_api_server"
NODE_ENV="production"

# Stop application if it is running
pm2 stop $APP_NAME
pm2 delete $APP_NAME

# Clear dist directory
yarn prebuild

# Install libraries
yarn install

# Build application
yarn build

# Launch application
pm2 start dist/main.js --log ./logs --name $APP_NAME

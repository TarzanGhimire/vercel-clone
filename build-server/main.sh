#!/bin/bash

# Start Redis server
redis-server --daemonize yes

# Export the Git repository URL
export GIT_REPOSITORY__URL="$GIT_REPOSITORY__URL"

# Debugging: Print the Git repository URL
echo "Cloning repository from URL: $GIT_REPOSITORY__URL"

# Create the output directory if it doesn't exist
mkdir -p /home/app/output

# Clone the Git repository
git clone "$GIT_REPOSITORY__URL" /home/app/output

# Check if the cloning was successful
if [ $? -ne 0 ]; then
  echo "Error: Failed to clone repository"
  exit 1
fi

# Change to the cloned repository directory
cd /home/app/output

# List the contents of the cloned repository for debugging
echo "Contents of /home/app/output:"
ls -la

# Check if package.json exists
if [ -f "package.json" ]; then
  echo "package.json found"
else
  echo "package.json not found"
fi

# Detect the type of project and install dependencies
if [ -f "package.json" ]; then
  echo "Detected Node.js project"
  npm install
  npm install @aws-sdk/client-s3

elif [ -f "requirements.txt" ]; then
  echo "Detected Python project"
  pip install -r requirements.txt
  # Add any additional build steps for Python projects here
else
  echo "Unsupported project type"
  exit 1
fi

# Check if the dist folder exists
if [ ! -d "/home/app/output/dist" ]; then
  echo "dist folder does not exist"
  #mkdir -p /home/app/output/dist
fi

# Run the application
exec node /home/app/script.js
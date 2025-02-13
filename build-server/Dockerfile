FROM ubuntu:focal

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
    curl \
    git \
    dos2unix \
    python3 \
    python3-pip \
    redis-server \
    && apt-get upgrade -y

# Install Node.js (and its dependencies)
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Install Python dependencies (uvicorn and FastAPI if needed)
RUN pip3 install uvicorn fastapi

# Set the working directory
WORKDIR /home/app

# Copy necessary files into the container
COPY main.sh ./main.sh
COPY package*.json ./
COPY script.js ./script.js

# Install Node.js dependencies
RUN npm install

# Debug: List installed Node.js packages
RUN npm list


# Convert all files in /home/app to Unix format
RUN find /home/app -type f -exec dos2unix {} +
# Ensure proper permissions for script and main.sh
RUN chmod +x /home/app/main.sh
RUN chmod +x /home/app/script.js

# List contents of /home/app for debugging
RUN ls -l /home/app

# Install Node.js dependencies and build the project

# Ensure that Redis is started within the container
RUN service redis-server start

# Set entrypoint to the main.sh script
ENTRYPOINT ["/home/app/main.sh"]

# Optionally, expose Redis port if you want to connect externally
EXPOSE 6379
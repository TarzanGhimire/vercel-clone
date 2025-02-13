
### Setup Guide

This Project contains following services and folders:

- `api-server`: HTTP API Server for REST API's
- `build-server`: Docker Image code which clones, builds and pushes the build to S3
- `s3-reverse-proxy`: Reverse Proxy the subdomains and domains to s3 bucket static assets

### Local Setup

1. Run `npm install` in all the 3 services i.e. `api-server`, `build-server` and `s3-reverse-proxy`
2. Docker build the `build-server` and push the image to AWS ECR.
3. Setup the `api-server` by providing all the required config such as TASK ARN and CLUSTER arn.
4. Run `node index.js` in `api-server` and `s3-reverse-proxy`

At this point following services would be up and running:

| S.No | Service            | PORT    |
| ---- | ------------------ | ------- |
| 1    | `api-server`       | `:9000` |
| 2    | `socket.io-server` | `:9002` |
| 3    | `s3-reverse-proxy` | `:8000` |






codes used till now:

npm install (in all three servers)

Use the following steps to authenticate and push an image to your repository. For additional registry authentication methods, including the Amazon ECR credential helper, see Registry Authentication .
Retrieve an authentication token and authenticate your Docker client to your registry. Use the AWS CLI:

$aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 061051256939.dkr.ecr.ap-south-1.amazonaws.com

Note: If you receive an error using the AWS CLI, make sure that you have the latest version of the AWS CLI and Docker installed.
Build your Docker image using the following command. For information on building a Docker file from scratch see the instructions here . You can skip this step if your image is already built:

$docker build -t builder-server .

to test locally:
$docker run -it -e GIT_REPOSITORY__URL=https://github.com/TarzanGhimire/skillhunt-vite -e PROJECT_ID=p0 builder-server

After the build completes, tag your image so you can push the image to this repository:

$docker tag builder-server:latest 061051256939.dkr.ecr.ap-south-1.amazonaws.com/builder-server:latest

Run the following command to push this image to your newly created AWS repository:

$docker push 061051256939.dkr.ecr.ap-south-1.amazonaws.com/builder-server:latest



api-server 

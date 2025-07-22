# Kubernetes Deployment for CloudForgeX

This directory contains the Kubernetes deployment configuration for the CloudForgeX AI chatbot.

## Overview

The Kubernetes deployment transforms the serverless Lambda function into a containerised application that can run in any Kubernetes environment, demonstrating versatility in deployment options.

## Key Components

1. **Dockerfile**: Multi-stage build for optimised container size
2. **wsgi.py**: WSGI adapter to bridge Lambda handler to web server
3. **Kubernetes Manifests**:
   - **configmap.yaml**: Environment variables for configuration
   - **deployment.yaml**: Pod lifecycle management
   - **service.yaml**: Network exposure

## Building and Running

```bash
# Build the Docker image
docker build -t cfx-chatbot -f k8s/Dockerfile .

# Run the container locally
docker run -p 8001:8000 \
  -e ALLOWED_ORIGIN="https://www.jarredthomas.cloud" \
  -e AWS_REGION="us-east-1" \
  -e DYNAMODB_TABLE="cfx-chatbot-logs" \
  -e BEDROCK_MODEL="anthropic.claude-instant-v1" \
  -v ~/.aws:/home/pyuser/.aws:ro \
  cfx-chatbot
```

## Kubernetes Deployment

```bash
# Start Minikube
minikube start

# Apply Kubernetes manifests
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Access the service
minikube service cfx-chatbot-service
```

## Best Practices Implemented

1. **Environment Variable Prioritization**: Modified code to check environment variables before SSM parameters
2. **Multi-Stage Docker Build**: Reduced image size and improved security
3. **Non-Root User**: Enhanced container security
4. **Health Checks**: Added health endpoint for monitoring
5. **Resource Limits**: Specified CPU and memory constraints

For more detailed information, see the [Architecture Documentation](../docs/architecture.md) and [Challenges and Learnings Documentation](../docs/challenges-and-learnings.md).
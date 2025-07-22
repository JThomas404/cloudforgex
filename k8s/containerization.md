# Containerisation and Kubernetes Deployment

## Overview

This document outlines the containerisation and Kubernetes deployment of the CloudForgeX AI chatbot, transforming the serverless Lambda function into a containerised application that can run in any Kubernetes environment.

## Containerisation

### Docker Implementation

The Lambda function was containerised using a multi-stage Docker build:

1. **Base Image**: Python 3.11.12-slim
2. **Environment Variables**: Replaced AWS SSM parameters with container environment variables
3. **Web Server**: Gunicorn with WSGI adapter
4. **Security**: Non-root user, minimal dependencies
5. **Health Check**: Endpoint at `/health` for container health monitoring

### Key Files

- `Dockerfile`: Multi-stage build for optimised container size
- `wsgi.py`: WSGI adapter to bridge Lambda handler to web server
- `requirements.txt`: Python dependencies including gunicorn

### Building and Running Locally

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

### Kubernetes Resources

1. **ConfigMap**: Stores environment variables
   - File: `configmap.yaml`
   - Purpose: Configuration for the application

2. **Deployment**: Manages pod lifecycle
   - File: `deployment.yaml`
   - Purpose: Ensures the application is running with the specified resources

3. **Service**: Exposes the application
   - File: `service.yaml`
   - Purpose: Makes the application accessible via network

### Deployment Steps

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

### Testing

- Health endpoint: `curl http://SERVICE_URL/health`
- Chat endpoint: `curl -X POST -H "Content-Type: application/json" -d '{"message":"Tell me about Jarred"}' http://SERVICE_URL/chat`

## Best Practices Implemented

1. **Environment Variable Prioritization**: Modified code to check environment variables before SSM parameters
2. **Multi-Stage Docker Build**: Reduced image size and improved security
3. **Non-Root User**: Enhanced container security
4. **Health Checks**: Added health endpoint for monitoring
5. **Resource Limits**: Specified CPU and memory constraints
6. **ConfigMap for Configuration**: Externalised configuration from code

## Future Improvements

1. **Secrets Management**: Use Kubernetes Secrets for sensitive information
2. **Horizontal Pod Autoscaling**: Scale based on CPU/memory usage
3. **Ingress Controller**: Add proper routing with TLS termination
4. **Persistent Storage**: Add volume mounts if needed
5. **CI/CD Pipeline**: Automate the build and deployment process
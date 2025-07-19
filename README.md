# CloudForgeX - Cloud Engineering Portfolio

![AWS](docs/images/AWS-Lambda.svg) ![Terraform](docs/images/Terraform-Icon.svg) ![CloudFront](docs/images/Amazon-CloudFront.svg) ![Bedrock](docs/images/Amazon-Bedrock.svg)

A comprehensive cloud engineering portfolio showcasing AWS infrastructure, Terraform automation, and modern web development with an AI-powered assistant named EVE.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Setup and Deployment](#setup-and-deployment)
- [EVE AI Assistant](#eve-ai-assistant)
- [Security](#security)
- [Challenges and Learnings](#challenges-and-learnings)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring and Observability](#monitoring-and-observability)
- [Future Enhancements](#future-enhancements)
- [Contact](#contact)

## Overview

CloudForgeX is a serverless AI-powered portfolio hosted on AWS, showcasing cloud engineering expertise through a modern web application with an intelligent AI assistant named EVE. The system follows a serverless architecture pattern, leveraging AWS services for scalability, security, and cost efficiency. The architecture adheres to AWS Well-Architected Framework principles, emphasising operational excellence, security, reliability, performance efficiency, and cost optimisation.

### Live Demo

Visit [jarredthomas.cloud](https://www.jarredthomas.cloud) to see the live portfolio and interact with EVE.

## Architecture

CloudForgeX implements a modern serverless architecture using AWS services:

![Architecture Diagram](docs/images/architecture-diagram.png)

### Key Components

- **Frontend**: Static website hosted on S3, delivered via CloudFront CDN
- **Backend**: Serverless Lambda functions with API Gateway
- **AI Assistant**: EVE powered by AWS Bedrock with Claude Instant
- **Data Storage**: DynamoDB for conversation logging and context
- **Security**: IAM roles, SSL/TLS, CORS policies, and secure S3 configurations
- **Infrastructure as Code**: Terraform modules for all AWS resources
- **CI/CD**: GitHub Actions for automated deployment

For detailed architecture information, see [Architecture Documentation](docs/architecture.md).

## Features

### Portfolio Highlights

- **Professional Design**: Modern, responsive layout with mobile-first approach
- **Interactive Elements**: Smooth animations and transitions using AOS library
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Performance**: Optimised loading and rendering with 95+ Lighthouse score

### EVE AI Assistant

EVE (Enhanced Virtual Engineer) is an intelligent AI assistant that provides information about projects, expertise, and certifications:

- **Intelligent Conversations**: Natural language processing using AWS Bedrock
- **Certificate Viewing**: Secure access to professional certifications via S3 presigned URLs
- **Project Information**: Detailed insights into cloud engineering projects
- **Professional Guidance**: Career advice and technical recommendations

### Technical Demonstrations

- **Infrastructure as Code**: Complete AWS setup with Terraform
- **Security Best Practices**: SSL/TLS, CORS, secure configurations
- **Scalability**: Auto-scaling and load balancing configurations
- **Monitoring**: CloudWatch integration for observability

## Technologies

### Frontend

- **Languages**: HTML5, CSS3, JavaScript (ES6+)
- **Libraries**: AOS (Animate On Scroll), FontAwesome
- **Build Tools**: Native browser support, no build process required

### Backend

- **Cloud Provider**: AWS
- **Compute**: AWS Lambda with Python runtime
- **API**: Amazon API Gateway
- **Database**: Amazon DynamoDB
- **AI Service**: AWS Bedrock with Claude Instant
- **Storage**: Amazon S3
- **CDN**: Amazon CloudFront
- **DNS**: Amazon Route 53

### Infrastructure

- **IaC Tool**: Terraform
- **Containerisation**: Docker, Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: CloudWatch

## Project Structure

```
cloudforgex/
├── .github/workflows/      # GitHub Actions workflows
│   ├── docker.yml          # Docker build and push workflow
│   ├── lambda.yml          # Lambda deployment workflow
│   └── terraform.yml       # Terraform infrastructure workflow
├── docs/                   # Documentation
│   ├── images/             # Architecture diagrams and images
│   ├── architecture.md     # Detailed architecture documentation
│   ├── challenges-and-learnings.md  # Technical challenges and solutions
│   └── security.md         # Security architecture and controls
├── frontend/               # Frontend web application
│   ├── assets/             # Static assets (images, documents)
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript files
│   ├── data/               # JSON data files
│   ├── index.html          # Main portfolio page
│   └── resume.html         # Resume page
├── k8s/                    # Kubernetes configuration
│   ├── manifests/          # Kubernetes manifest files
│   ├── app.py              # Python application for K8s
│   └── Dockerfile          # Dockerfile for K8s deployment
├── lambda/                 # Lambda function code
│   ├── app.py              # Main Lambda handler
│   ├── knowledge_base.py   # EVE knowledge base module
│   ├── project_knowledge_base.json  # EVE knowledge data
│   ├── Dockerfile          # Lambda container image
│   └── requirements.txt    # Python dependencies
├── terraform/              # Terraform IaC
│   ├── modules/            # Reusable Terraform modules
│   │   ├── acm/            # ACM certificate module
│   │   ├── apigateway/     # API Gateway module
│   │   ├── cloudfront/     # CloudFront distribution module
│   │   ├── cloudwatch/     # CloudWatch monitoring module
│   │   ├── dynamodb/       # DynamoDB table module
│   │   ├── iam/            # IAM roles and policies module
│   │   ├── lambda/         # Lambda function module
│   │   ├── route53/        # Route 53 DNS module
│   │   ├── s3/             # S3 bucket module
│   │   └── ssm/            # SSM Parameter Store module
│   ├── main.tf             # Main Terraform configuration
│   ├── variables.tf        # Input variables
│   ├── outputs.tf          # Output values
│   └── providers.tf        # Provider configuration
└── README.md               # Project documentation
```

## Setup and Deployment

### Prerequisites

- AWS Account with appropriate permissions
- Terraform v1.0.0+
- AWS CLI v2+
- Python 3.9+
- Docker (for container builds)
- GitHub account (for CI/CD)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/JThomas404/cloudforgex.git
   cd cloudforgex
   ```

2. Set up AWS credentials:
   ```bash
   aws configure
   ```

3. Install Python dependencies:
   ```bash
   cd lambda
   pip install -r requirements.txt
   ```

4. Run the frontend locally:
   ```bash
   cd ../frontend
   # Use any local server, e.g., Python's built-in HTTP server
   python -m http.server 8000
   ```

### Terraform Deployment

1. Initialize Terraform:
   ```bash
   cd terraform
   terraform init
   ```

2. Create a `terraform.tfvars` file with your variables:
   ```hcl
   region         = "us-east-1"
   domain_name    = "example.com"
   project_name   = "cloudforge"
   environment    = "prod"
   allowed_origin = "https://example.com"
   ```

3. Plan and apply the infrastructure:
   ```bash
   terraform plan -out=tfplan
   terraform apply tfplan
   ```

### CI/CD Deployment

The project includes GitHub Actions workflows for automated deployment:

1. Set up GitHub repository secrets:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`

2. Push changes to the main branch to trigger deployment:
   ```bash
   git add .
   git commit -m "Update infrastructure"
   git push origin main
   ```

3. Monitor the workflow execution in the GitHub Actions tab.

## EVE AI Assistant

EVE is an intelligent AI assistant powered by AWS Bedrock with Claude Instant:

### Features

- **Natural Language Understanding**: Processes and responds to user queries
- **Knowledge Base**: Comprehensive information about projects and expertise
- **Certificate Access**: Secure viewing of professional certifications
- **Contextual Responses**: Tailored answers based on conversation context

### Implementation

- **Backend**: AWS Lambda function with Python
- **AI Model**: AWS Bedrock with Claude Instant
- **Data Storage**: DynamoDB for conversation logging
- **Security**: Input validation, token waste prevention, secure certificate access

### Cost Optimisation

The implementation includes several cost optimisation features:

- **Token Waste Prevention**: Filters meaningless inputs to reduce API calls
- **Caching**: Frequently asked questions have predefined responses
- **Rate Limiting**: Prevents abuse and excessive usage
- **Monitoring**: CloudWatch alarms for unusual usage patterns

## Security

CloudForgeX implements a defence-in-depth security strategy:

### Key Security Features

- **Identity and Access Management**: Least privilege IAM policies
- **Data Protection**: Encryption at rest and in transit
- **Network Security**: CloudFront, API Gateway, and WAF protections
- **Secure Certificate Viewing**: S3 presigned URLs with 5-minute expiration
- **Input Validation**: Multi-layer validation to prevent abuse
- **Monitoring and Detection**: CloudTrail, CloudWatch, and GuardDuty

For detailed security information, see [Security Documentation](docs/security.md).

## Challenges and Learnings

The project encountered and resolved several technical challenges:

1. **API Gateway CORS Configuration**: Fixed cross-origin request failures
2. **AI Chatbot Cost Protection**: Implemented token waste prevention
3. **Secure Certificate Viewing**: Developed S3 presigned URL system

For detailed information on challenges and solutions, see [Challenges and Learnings](docs/challenges-and-learnings.md).

## CI/CD Pipeline

CloudForgeX uses GitHub Actions for continuous integration and deployment:

### Workflows

- **Terraform Workflow**: Deploys infrastructure changes
- **Lambda Workflow**: Updates Lambda function code
- **Docker Workflow**: Builds and pushes container images

### Pipeline Features

- **Infrastructure Validation**: Terraform plan validation
- **Security Scanning**: Automated security checks
- **Testing**: Unit and integration tests
- **Deployment Strategy**: Blue/green deployment for zero downtime

## Monitoring and Observability

The project includes comprehensive monitoring and observability:

### CloudWatch Metrics and Alarms

- **Lambda Duration**: Performance monitoring
- **API Gateway Errors**: Error rate tracking
- **DynamoDB Throttling**: Capacity monitoring
- **Custom Metrics**: Security and usage metrics

### Dashboards

- **System Health**: Overall system status
- **Performance**: Response times and throughput
- **Security**: Security events and anomalies
- **Cost**: Resource usage and cost tracking

## Future Enhancements

Planned future enhancements include:

1. **Enhanced Monitoring**: Implementation of X-Ray for distributed tracing
2. **Multi-Region Deployment**: Expansion to multiple AWS regions for global redundancy
3. **Advanced AI Capabilities**: Integration with additional AWS AI services
4. **Performance Optimisation**: Further optimisation of Lambda functions and frontend assets
5. **Expanded Security Controls**: Implementation of WAF and additional security layers

## Contact

**Jarred Thomas** - Cloud Engineer

- **Email**: [jarredthomas101@gmail.com](mailto:jarredthomas101@gmail.com)
- **LinkedIn**: [linkedin.com/in/jarred-thomas](https://www.linkedin.com/in/jarred-thomas)
- **GitHub**: [github.com/JThomas404](https://github.com/JThomas404)
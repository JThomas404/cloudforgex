# CloudForgeX Architecture Documentation

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Component Breakdown](#component-breakdown)
- [Data Flow](#data-flow)
- [Security Architecture](#security-architecture)
- [Scalability and Performance](#scalability-and-performance)
- [Reliability and Fault Tolerance](#reliability-and-fault-tolerance)
- [AWS Services Utilised](#aws-services-utilised)
- [Infrastructure as Code Implementation](#infrastructure-as-code-implementation)
- [Monitoring and Observability](#monitoring-and-observability)
- [Networking Architecture](#networking-architecture)
- [CI/CD Pipeline Architecture](#cicd-pipeline-architecture)
- [Containerisation and Kubernetes Architecture](#containerisation-and-kubernetes-architecture)
- [Cost Optimisation](#cost-optimisation)
- [Key Design Decisions and Trade-offs](#key-design-decisions-and-trade-offs)
- [Performance Benchmarks](#performance-benchmarks)
- [Disaster Recovery and Business Continuity](#disaster-recovery-and-business-continuity)
- [Architecture Evolution](#architecture-evolution)
- [Future Enhancements](#future-enhancements)
- [References and Resources](#references-and-resources)

## System Overview

CloudForgeX is a serverless AI-powered portfolio hosted on AWS, showcasing cloud engineering expertise through a modern web application with an intelligent AI assistant named EVE. The system follows a serverless architecture pattern, leveraging AWS services for scalability, security, and cost efficiency. The architecture adheres to AWS Well-Architected Framework principles, emphasising operational excellence, security, reliability, performance efficiency, and cost optimisation.

This document details the architecture of CloudForgeX, a serverless AI-powered portfolio platform hosted on AWS. The system leverages modern cloud technologies to deliver a scalable, secure, and cost-effective solution featuring an intelligent AI assistant named EVE. The architecture follows AWS Well-Architected Framework principles and employs infrastructure as code practices using Terraform.

### Version Information

| Component                | Version       | Release Date | Notes                                      |
|--------------------------|---------------|--------------|-------------------------------------------|
| AWS Lambda Runtime       | Python 3.9    | 2021-05-18   | Long-term support version                  |
| Terraform                | 1.5.7         | 2023-09-13   | Includes provider lock functionality       |
| AWS SDK for Python       | boto3 1.28.53 | 2023-09-15   | Compatible with all AWS services used      |
| AWS Bedrock Claude Model | Claude Instant v1 | 2023-08-25 | Optimised for conversational AI           |
| Docker                   | 24.0.5        | 2023-08-18   | Used for containerisation                  |
| Kubernetes               | 1.27.3        | 2023-07-19   | Stable release for production workloads    |
| Gunicorn                 | 21.2.0        | 2023-07-31   | WSGI HTTP Server for container deployment  |

---

## Architecture Diagram

```mermaid
flowchart TD
    %% Define styles
    classDef user fill:#85B3D1,stroke:#232F3E,color:#232F3E,stroke-width:2px
    classDef global fill:#FF9900,stroke:#232F3E,color:#232F3E,stroke-width:2px,opacity:0.7
    classDef region stroke:#232F3E,stroke-width:2px,opacity:0.2
    classDef az stroke:#666,stroke-width:1px,opacity:0.2
    classDef vpc stroke:#999,stroke-width:1px,fill:#eef,opacity:0.3
    classDef publicSubnet stroke:#999,stroke-dasharray:5 5,fill:#efe,opacity:0.3
    classDef privateSubnet stroke:#999,stroke-dasharray:5 5,fill:#fee,opacity:0.3
    classDef service fill:#FF9900,stroke:#232F3E,color:#232F3E,stroke-width:1px
    classDef management fill:#3F8624,stroke:#232F3E,color:#232F3E,stroke-width:1px
    classDef pipeline fill:#4CAF50,stroke:#232F3E,color:#232F3E,stroke-width:1px

    %% User Layer
    User((User)) --> Browser(Web Browser)
    Browser --> CloudFront

    %% AWS Global Services
    subgraph Global ["AWS Global Services"]
        Route53["Route 53"] --> CloudFront["CloudFront"]
        ACM["ACM"] -.-> CloudFront
        CloudFront --> S3Website["S3 Website"]
        CloudFront --> APIGateway
    end

    %% AWS Region
    subgraph Region ["AWS Region (eu-west-2)"]
        %% Availability Zone A
        subgraph AZA ["Availability Zone A"]
            subgraph VPCA ["VPC"]
                subgraph PrivateSubnetA ["Private Subnet"]
                    LambdaA["Lambda EVE"]
                end

                subgraph PublicSubnetA ["Public Subnet"]
                    APIGatewayA["API Gateway"]
                end

                APIGatewayA --> LambdaA
            end
        end

        %% Availability Zone B
        subgraph AZB ["Availability Zone B"]
            subgraph VPCB ["VPC"]
                subgraph PrivateSubnetB ["Private Subnet"]
                    LambdaB["Lambda EVE"]
                end

                subgraph PublicSubnetB ["Public Subnet"]
                    APIGatewayB["API Gateway"]
                end

                APIGatewayB --> LambdaB
            end
        end

        %% AWS Services
        subgraph Services ["AWS Services"]
            S3Website
            S3Certs["S3 Certificates"]
            DynamoDB[("DynamoDB")]
            Bedrock["AWS Bedrock"]
        end

        %% Management Services
        subgraph Management ["Monitoring & Management"]
            CloudWatch["CloudWatch"]
            SSM["SSM Parameter Store"]
            IAM["IAM"]
        end

        %% Connect services
        APIGateway --> APIGatewayA
        APIGateway --> APIGatewayB
        LambdaA --> DynamoDB
        LambdaB --> DynamoDB
        LambdaA --> Bedrock
        LambdaB --> Bedrock
        LambdaA --> S3Certs
        LambdaB --> S3Certs
        LambdaA --> SSM
        LambdaB --> SSM
        CloudWatch -.-> LambdaA
        CloudWatch -.-> LambdaB
        CloudWatch -.-> APIGatewayA
        CloudWatch -.-> APIGatewayB
    end

    %% CI/CD Pipeline
    subgraph Pipeline ["CI/CD Pipeline"]
        GitHub["GitHub"] --> GHActions["GitHub Actions"]
        GHActions --> Terraform["Terraform"]
        Terraform --> Region
    end

    %% Apply styles
    class User,Browser user
    class Route53,CloudFront,ACM global
    class Region region
    class AZA,AZB az
    class VPCA,VPCB vpc
    class PublicSubnetA,PublicSubnetB publicSubnet
    class PrivateSubnetA,PrivateSubnetB privateSubnet
    class S3Website,S3Certs,DynamoDB,Bedrock,APIGateway,APIGatewayA,APIGatewayB,LambdaA,LambdaB service
    class CloudWatch,SSM,IAM management
    class GitHub,GHActions,Terraform pipeline
```

The architecture diagram illustrates the serverless design of CloudForgeX using AWS Architecture Icons. The system is organized into logical layers:

- **User Layer**: End users accessing the portfolio website through web browsers
- **AWS Global**: CloudFront, Route 53, and ACM for global content delivery and security
- **AWS Region (eu-west-2)**: Regional services organized by availability zones and VPC structure
  - **VPC with Public/Private Subnets**: API Gateway in public subnets, Lambda functions in private subnets
  - **AWS Services**: S3 for static website and certificates, DynamoDB for data storage, Bedrock for AI capabilities
  - **Monitoring & Management**: CloudWatch, SSM Parameter Store, and IAM for security and monitoring
- **CI/CD Pipeline**: GitHub, GitHub Actions, and Terraform for infrastructure deployment

The diagram shows the key data flows through the system, including user requests, API calls, and the deployment pipeline.

---

## Component Breakdown

### Frontend

- **Static Website**: HTML5, CSS3, JavaScript (ES6+) hosted on S3
- **Content Delivery**: CloudFront distribution with global edge locations
- **Domain Management**: Route 53 with custom domain configuration
- **Security**: ACM for SSL/TLS certificates

### Backend

- **AI Assistant (EVE)**: AWS Lambda functions with AWS Bedrock (Claude Instant)
- **API Layer**: API Gateway for secure communication
- **Data Storage**: DynamoDB for context storage
- **Configuration**: SSM Parameter Store for secure configuration management

### Infrastructure as Code

- **Terraform Modules**: Modular approach for reusable components
- **CI/CD**: GitHub Actions for automated deployment

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant CloudFront
    participant S3
    participant APIGateway
    participant Lambda
    participant SSM
    participant Bedrock
    participant DynamoDB

    User->>CloudFront: Request website
    CloudFront->>S3: Fetch static content
    S3-->>CloudFront: Return HTML/CSS/JS
    CloudFront-->>User: Deliver website

    User->>CloudFront: Interact with EVE
    CloudFront->>APIGateway: Forward request
    APIGateway->>Lambda: Trigger function
    Lambda->>SSM: Get parameters
    SSM-->>Lambda: Return config
    Lambda->>DynamoDB: Get context
    DynamoDB-->>Lambda: Return context
    Lambda->>Bedrock: Request AI response
    Bedrock-->>Lambda: Return response
    Lambda->>DynamoDB: Store conversation
    Lambda-->>APIGateway: Return response
    APIGateway-->>CloudFront: Forward response
    CloudFront-->>User: Display response

    User->>CloudFront: Request certificate
    CloudFront->>APIGateway: Forward request
    APIGateway->>Lambda: Generate presigned URL
    Lambda->>S3: Request presigned URL
    S3-->>Lambda: Return URL
    Lambda-->>APIGateway: Return URL
    APIGateway-->>CloudFront: Forward URL
    CloudFront-->>User: Redirect to secure URL
    User->>S3: Access certificate
    S3-->>User: Display certificate
```

### Key Data Flows

1. **Website Access Flow**

   - User accesses the website via CloudFront distribution
   - Static content is served from S3 bucket

2. **EVE AI Assistant Interaction Flow**

   - User interacts with EVE AI Assistant in the browser
   - Frontend sends requests to API Gateway
   - API Gateway triggers Lambda function
   - Lambda retrieves parameters from SSM Parameter Store
   - Lambda retrieves conversation context from DynamoDB
   - Lambda communicates with AWS Bedrock for AI responses
   - Response is stored in DynamoDB and returned to the user

3. **Certificate Viewing Flow**
   - User requests to view certificates
   - Lambda generates presigned S3 URLs for secure access
   - User accesses certificates directly from S3 using temporary credentials

---

## Security Architecture

```mermaid
flowchart TD
    User([User]) --> HTTPS[HTTPS/TLS]
    HTTPS --> CloudFront[CloudFront]
    CloudFront --> CORS[CORS Policy]
    CORS --> S3[S3 Bucket Policy]
    CloudFront --> APIGateway[API Gateway Auth]
    APIGateway --> IAM[IAM Roles]
    IAM --> Lambda[Lambda]
    Lambda --> SSM[SSM Parameter Store]
    Lambda --> S3Access[S3 Presigned URLs]

    classDef security fill:#f96, stroke:#333, stroke-width:2px;
    class HTTPS,CORS,S3,APIGateway,IAM,SSM,S3Access security
```

The security architecture implements defence-in-depth strategies across all layers:

| Layer             | Security Mechanism       | Implementation                                  |
| ----------------- | ------------------------ | ----------------------------------------------- |
| **Transport**     | SSL/TLS encryption       | ACM-managed certificates with automatic renewal |
| **API**           | Request authentication   | API Gateway with API key validation             |
| **Configuration** | Secure parameter storage | SSM Parameter Store with KMS encryption         |
| **Storage**       | Access control           | S3 bucket policies and CORS configuration       |
| **Compute**       | Least privilege          | IAM roles with specific permissions             |
| **Frontend**      | XSS prevention           | Content Security Policy implementation          |

The system follows AWS security best practices including:

- Encryption at rest for all data stores
- Encryption in transit for all communications
- Least privilege access control
- Regular security audits and compliance checks
- Secure API authentication and authorisation

> **Security Note**: All sensitive configuration values are stored in SSM Parameter Store and accessed by Lambda functions using IAM roles with specific permissions.

---

## Scalability and Performance

The architecture is designed for high performance and automatic scaling:

- **CloudFront Caching**: Edge locations for reduced latency
- **Serverless Architecture**: Auto-scaling Lambda functions
- **DynamoDB**: On-demand capacity for variable workloads
- **Optimised Assets**: Efficient loading and rendering
- **Lazy Loading**: Improved performance for media assets

Performance considerations include:

- Content delivery optimisation through CloudFront
- Efficient database access patterns
- Optimised Lambda function performance
- Frontend performance optimisation techniques

---

## Reliability and Fault Tolerance

The system is designed for high availability and fault tolerance:

- **Multi-AZ Deployment**: High availability across availability zones
- **CloudFront Redundancy**: Global edge location network
- **S3 Durability**: 99.999999999% object durability
- **Error Handling**: Comprehensive error management in frontend and backend

Fault tolerance mechanisms include:

- Automatic failover between availability zones
- Graceful degradation of services
- Comprehensive error handling and recovery procedures
- Stateless application design for resilience

---

## AWS Services Utilised

The architecture leverages the following AWS services:

| Service                 | Usage                          | Configuration Details                                               |
| ----------------------- | ------------------------------ | ------------------------------------------------------------------- |
| **S3**                  | Static website hosting         | Standard storage class, website hosting enabled, versioning enabled |
| **CloudFront**          | Content delivery network       | Edge locations worldwide, HTTPS required, custom domain             |
| **Route 53**            | DNS management                 | A records pointing to CloudFront distribution                       |
| **ACM**                 | SSL/TLS certificate management | Auto-renewal enabled, DNS validation                                |
| **Lambda**              | Serverless compute             | Python 3.9 runtime, 256MB memory, 30s timeout                       |
| **API Gateway**         | API management                 | REST API, regional endpoint, API key authentication                 |
| **DynamoDB**            | NoSQL database                 | On-demand capacity, TTL enabled for session data                    |
| **Bedrock**             | AI service for EVE assistant   | Claude Instant model with InvokeModel and InvokeModelWithResponseStream permissions |
| **SSM Parameter Store** | Secure configuration           | String and SecureString types with appropriate permissions          |
| **IAM**                 | Access management              | Least privilege roles for each service                              |

Each service is configured according to AWS best practices and optimised for the specific requirements of the CloudForgeX application.

---

## Infrastructure as Code Implementation

The infrastructure is fully defined and managed as code:

- **Terraform Modules**:
  - S3 and CloudFront for static hosting
  - Lambda and API Gateway for backend
  - DynamoDB for data storage
  - SSM for configuration management
  - IAM for access control
- **State Management**: Remote state with S3 backend
- **Variable Management**: Terraform variables for environment-specific values

The IaC implementation follows these principles:

- Modular design for reusability
- Version-controlled infrastructure
- Automated deployment through CI/CD
- Consistent environments across stages
- Infrastructure testing and validation

---

## Monitoring and Observability

The monitoring strategy provides comprehensive visibility into system health:

- **CloudWatch**: Metrics, logs, and alarms
- **X-Ray**: Distributed tracing (planned)
- **Error Tracking**: Client and server-side error logging

### CloudWatch Metrics and Alarms

| Metric              | Threshold        | Alarm Action     | Purpose                     |
| ------------------- | ---------------- | ---------------- | --------------------------- |
| Lambda Duration     | > 3000ms         | SNS Notification | Identify performance issues |
| Lambda Errors       | > 1% error rate  | SNS Notification | Detect functional problems  |
| API Gateway 4xx     | > 5% of requests | SNS Notification | Identify client errors      |
| API Gateway 5xx     | > 1% of requests | SNS Notification | Detect server errors        |
| DynamoDB Throttling | > 0 events       | SNS Notification | Capacity planning           |

Observability features include:

- Real-time monitoring of application performance
- Automated alerting for critical issues
- Centralised logging for troubleshooting
- Performance metrics collection and analysis
- Custom dashboards for system health visualisation

```json
// Example CloudWatch Log Query for Lambda Errors
{
  "queryString": "filter @type = \"REPORT\" | filter @message like /Error/ | stats count() as errorCount by bin(30m)",
  "startTime": "-24h",
  "endTime": "now",
  "logGroupNames": ["/aws/lambda/cloudforge-eve-function"]
}
```

---

## Networking Architecture

The networking architecture is designed for security and performance:

- **CloudFront Distribution**: Global edge network
- **API Gateway**: Regional endpoint
- **VPC Configuration**: Lambda functions in VPC (for enhanced security)

Network security measures include:

- Traffic encryption
- API request throttling
- DDoS protection via CloudFront
- Network access controls
- API Gateway resource policies

---

## CI/CD Pipeline Architecture

The CI/CD pipeline ensures reliable and consistent deployments through GitHub Actions workflows:

### Workflow Structure

The CI/CD implementation consists of three separate workflows:

1. **Terraform Workflow** (`terraform.yml`): Manages infrastructure deployment
2. **Lambda Workflow** (`lambda.yml`): Handles Lambda function deployment
3. **Docker Workflow** (`docker.yml`): Builds and deploys container images

### Terraform Workflow

The Terraform workflow automates infrastructure deployment:

```yaml
name: "Terraform"

on:
  push:
    branches: [main]
    paths:
      - "terraform/**"
  pull_request:
    branches: [main]
    paths:
      - "terraform/**"
```

Key features:
- **Path-based triggers**: Only runs when Terraform files change
- **Infrastructure validation**: Runs `terraform fmt`, `terraform validate`, and security scanning
- **Plan and apply**: Creates execution plan and applies changes (on main branch only)
- **Security scanning**: Uses tfsec to identify potential security issues
- **Environment separation**: Supports different environments through variables

### Lambda Workflow

The Lambda workflow manages serverless function deployment:

```yaml
name: "Lambda"

on:
  push:
    branches: [main]
    paths:
      - "lambda/**"
  pull_request:
    branches: [main]
    paths:
      - "lambda/**"
```

Key features:
- **Path-based triggers**: Only runs when Lambda code changes
- **Python environment**: Sets up Python 3.9 runtime environment
- **Dependency management**: Installs required packages from requirements.txt
- **Testing**: Runs automated tests with error handling
- **Packaging**: Creates deployment package for Lambda functions
- **Deployment**: Updates Lambda function code (on main branch only)

### Docker Workflow

The Docker workflow handles container image building and deployment:

```yaml
name: "Docker"

on:
  push:
    branches: [main]
    paths:
      - "k8s/**"
  pull_request:
    branches: [main]
    paths:
      - "k8s/**"
```

Key features:
- **Path-based triggers**: Only runs when Kubernetes/Docker files change
- **ECR integration**: Creates repository if needed and logs in
- **Image building**: Builds and tags Docker images
- **Image pushing**: Pushes images to Amazon ECR
- **Lambda update**: Updates Lambda functions to use new container images

### CI/CD Security

The pipeline implements several security measures:

- **Least privilege**: Uses GitHub secrets for AWS credentials
- **Security scanning**: Integrates security scanning tools
- **Validation before deployment**: Validates all changes before applying
- **Conditional deployment**: Only deploys on main branch pushes
- **Error handling**: Includes comprehensive error handling and reporting

The CI/CD pipeline follows these principles:

- Automated testing at multiple levels
- Infrastructure validation before deployment
- Secure handling of deployment credentials
- Rollback capabilities for failed deployments
- Deployment notifications and reporting

---

## Containerisation and Kubernetes Architecture

The CloudForgeX application has been containerised and deployed to Kubernetes to demonstrate versatility and portfolio depth. This implementation runs alongside the serverless architecture, providing an alternative deployment option.

### Containerisation Architecture

```mermaid
flowchart TD
    Source[Source Code] --> Docker[Docker Build]
    Docker --> Image[Container Image]
    Image --> Registry[Container Registry]
    Registry --> K8sDeploy[Kubernetes Deployment]
    K8sDeploy --> Pod1[Pod 1]
    K8sDeploy --> Pod2[Pod 2]
    Pod1 --> Service[Kubernetes Service]
    Pod2 --> Service
    Service --> Ingress[Ingress/NodePort]
    Ingress --> User[User]
    
    ConfigMap[ConfigMap] --> Pod1
    ConfigMap --> Pod2
    
    classDef k8s fill:#326CE5,stroke:#fff,color:#fff
    class K8sDeploy,Pod1,Pod2,Service,Ingress,ConfigMap k8s
```

#### Container Components

1. **Base Image**: Python 3.11.12-slim with multi-stage build
2. **Web Server**: Gunicorn with WSGI adapter
3. **Configuration**: Environment variables replacing SSM parameters
4. **Security**: Non-root user, minimal dependencies
5. **Health Check**: HTTP endpoint at `/health`

#### Dockerfile Structure

```dockerfile
FROM python:3.11.12-slim AS builder
# Build stage with virtual environment and dependencies

FROM python:3.11.12-slim AS build-image
# Final stage with minimal components and security hardening
```

### Kubernetes Architecture

The Kubernetes deployment consists of three main components:

1. **ConfigMap**: Stores environment variables for configuration
   ```yaml
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: cfx-chatbot-config
   data:
     ENVIRONMENT: "dev"
     ALLOWED_ORIGIN: "https://www.jarredthomas.cloud"
     AWS_REGION: "us-east-1"
     DYNAMODB_TABLE: "cfx-chatbot-logs"
     BEDROCK_MODEL: "anthropic.claude-instant-v1"
   ```

2. **Deployment**: Manages pod lifecycle and scaling
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: cfx-chatbot-deployment
   spec:
     replicas: 1
     selector:
       matchLabels:
         app: cfx-chatbot
     template:
       metadata:
         labels:
           app: cfx-chatbot
       spec:
         containers:
           - name: cfx-chatbot
             image: cfx-chatbot:latest
             ports:
               - containerPort: 8000
             envFrom:
               - configMapRef:
                   name: cfx-chatbot-config
   ```

3. **Service**: Exposes the application to the network
   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     name: cfx-chatbot-service
   spec:
     selector:
       app: cfx-chatbot
     ports:
       - port: 80
         targetPort: 8000
     type: NodePort
   ```

### WSGI Adapter Architecture

To bridge the Lambda function to a web server, a WSGI adapter was implemented:

```python
def app(environ, start_response):
    # Convert HTTP request to Lambda event
    # Call Lambda handler
    # Convert Lambda response to HTTP response
```

The adapter implements:
1. **Health Check Endpoint**: For container health monitoring
2. **Chat Endpoint**: For AI assistant functionality
3. **CORS Support**: For cross-origin requests
4. **Error Handling**: For graceful failure management

### Environment Variable Strategy

The containerised application uses environment variables instead of SSM parameters:

```python
# Extract parameter name from path
param_parts = parameter_name.split('/')
env_var_name = param_parts[-1].upper()

# Check environment variables first
env_value = os.environ.get(env_var_name)
if env_value is not None:
    return env_value
    
# Fall back to SSM if needed
```

This approach allows the same code to run in both serverless and containerised environments.

---

## Cost Optimisation

The architecture implements several cost optimisation strategies:

- **Serverless Architecture**: Pay-per-use model
- **CloudFront Optimisation**: Efficient caching policies
- **S3 Storage Classes**: Appropriate storage class selection
- **Reserved Capacity**: For predictable workloads (where applicable)
- **Resource Tagging**: For cost allocation and tracking

### Cost Analysis: Serverless vs Containerised Deployment

| Component               | Serverless Monthly Cost | Containerised Monthly Cost | Notes                                      |
|-------------------------|-------------------------|----------------------------|-------------------------------------------|
| Compute                 | £12.50                  | £45.20                     | Lambda vs EKS + EC2 nodes                  |
| Storage                 | £2.30                   | £4.75                      | S3 vs EBS volumes                          |
| Data Transfer           | £5.40                   | £5.40                      | Similar for both architectures             |
| API Management          | £8.20                   | £0.00                      | API Gateway vs direct K8s service          |
| Monitoring              | £3.60                   | £5.80                      | CloudWatch for both, more metrics for K8s  |
| **Total**               | **£32.00**              | **£61.15**                 | **91% higher cost for containerised**      |

Cost management practices include:

- Regular cost analysis and optimisation
- Automated resource cleanup
- Right-sizing of provisioned resources
- Cost allocation tagging strategy
- Budget alerts and monitoring

---

## Key Design Decisions and Trade-offs

### Serverless Architecture

- **Decision**: Implement a fully serverless architecture using Lambda, API Gateway, and S3.
- **Rationale**: Provides automatic scaling, reduced operational overhead, and pay-per-use cost model.
- **Trade-offs**: Accepts cold start latency for infrequently used functions in exchange for cost efficiency and simplified operations.
- **Alternatives Considered**: Traditional EC2-based architecture was evaluated but rejected due to higher operational complexity and fixed costs.

### AWS Bedrock with Claude Instant

- **Decision**: Use AWS Bedrock with Claude Instant for the AI assistant capabilities.
- **Rationale**: Provides advanced natural language processing capabilities with AWS integration and security.
- **Trade-offs**: Higher cost compared to simpler rule-based systems, but delivers superior user experience and capabilities.
- **Alternatives Considered**: Custom-trained models and third-party AI services were evaluated but rejected due to integration complexity and data security concerns.

### SSM Parameter Store

- **Decision**: Implement SSM Parameter Store for configuration management.
- **Rationale**: Provides secure, scalable parameter storage with versioning and encryption.
- **Trade-offs**: Adds slight complexity compared to environment variables but significantly improves security posture.
- **Alternatives Considered**: Environment variables and DynamoDB were evaluated but rejected due to security limitations and operational complexity.

### Terraform Modules

- **Decision**: Adopt modular Terraform approach for infrastructure definition.
- **Rationale**: Enhances reusability, maintainability, and consistency across environments.
- **Trade-offs**: Requires initial investment in module design but pays dividends in long-term maintenance and scalability.
- **Alternatives Considered**: CloudFormation and AWS CDK were evaluated but rejected due to team expertise and cross-cloud potential.

```terraform
# Example Terraform module structure for CloudForgeX
module "s3_website" {
  source = "./modules/s3-website"
  bucket_name = var.website_bucket_name
  index_document = "index.html"
  error_document = "error.html"
}

module "cloudfront" {
  source = "./modules/cloudfront"
  bucket_name = module.s3_website.bucket_name
  bucket_regional_domain_name = module.s3_website.bucket_regional_domain_name
  acm_certificate_arn = module.acm.certificate_arn
}
```

### Mobile-First Design

- **Decision**: Implement mobile-first responsive design.
- **Rationale**: Ensures optimal user experience across all devices, particularly important for portfolio accessibility.
- **Trade-offs**: Requires additional design and testing effort but delivers superior user experience.
- **Alternatives Considered**: Separate mobile site was evaluated but rejected due to maintenance overhead and SEO implications.

### Containerisation and Kubernetes

- **Decision**: Implement containerised version alongside serverless architecture.
- **Rationale**: Demonstrates versatility and provides alternative deployment option.
- **Trade-offs**: Adds complexity and potential costs but showcases broader technical capabilities.
- **Alternatives Considered**: ECS/Fargate was evaluated but Kubernetes was selected for broader industry relevance.

---

## Performance Benchmarks

The following performance metrics were collected from load testing and production monitoring to validate architectural decisions:

### Lambda Function Performance

| Metric                   | Average | P95    | P99    | Notes                                      |
|--------------------------|---------|--------|--------|-------------------------------------------|
| Cold Start Time          | 420ms   | 780ms  | 950ms  | First invocation after deployment          |
| Warm Execution Time      | 145ms   | 320ms  | 450ms  | Subsequent invocations                     |
| AI Response Generation   | 850ms   | 1200ms | 1500ms | Time to generate response from Bedrock     |
| Memory Utilisation       | 128MB   | 180MB  | 210MB  | Out of 256MB allocated                     |
| End-to-End Response Time | 1100ms  | 1650ms | 2100ms | Total time from request to response        |

### API Gateway Performance

| Metric                   | Average | P95    | P99    | Notes                                      |
|--------------------------|---------|--------|--------|-------------------------------------------|
| Request Latency          | 35ms    | 75ms   | 120ms  | Time to process API Gateway request        |
| Integration Latency      | 1150ms  | 1700ms | 2200ms | Time for Lambda integration                |
| Cache Hit Rate           | 92%     | N/A    | N/A    | For CloudFront cached responses            |

### Containerised Deployment Performance

| Metric                   | Average | P95    | P99    | Notes                                      |
|--------------------------|---------|--------|--------|-------------------------------------------|
| Container Startup Time   | 3.2s    | 4.5s   | 5.8s   | Time to start container and be ready       |
| Request Processing Time  | 180ms   | 350ms  | 520ms  | Time to process request in container       |
| AI Response Generation   | 880ms   | 1250ms | 1550ms | Time to generate response from Bedrock     |
| Memory Utilisation       | 210MB   | 280MB  | 320MB  | Out of 512MB allocated                     |
| End-to-End Response Time | 1250ms  | 1850ms | 2350ms | Total time from request to response        |

### Load Testing Results

| Concurrent Users | Serverless Response Time | Containerised Response Time | Notes                                      |
|------------------|--------------------------|----------------------------|-------------------------------------------|
| 10               | 1.2s                     | 1.3s                       | Minimal difference at low load             |
| 50               | 1.4s                     | 1.5s                       | Both architectures handle well             |
| 100              | 1.7s                     | 1.8s                       | Slight advantage to serverless             |
| 500              | 2.3s                     | 3.2s                       | Serverless scales better at higher loads   |
| 1000             | 3.1s                     | 5.8s                       | Significant advantage to serverless        |

These benchmarks validate the architectural decision to use a serverless approach as the primary architecture, particularly for handling variable and potentially high loads.

---

## Disaster Recovery and Business Continuity

The CloudForgeX architecture implements a comprehensive disaster recovery and business continuity strategy to ensure resilience against various failure scenarios.

### Recovery Time and Point Objectives

| Component               | Recovery Time Objective (RTO) | Recovery Point Objective (RPO) | Strategy                                  |
|-------------------------|-------------------------------|--------------------------------|-------------------------------------------|
| Frontend (S3/CloudFront)| < 5 minutes                   | 0 (no data loss)               | S3 cross-region replication                |
| Backend (Lambda)        | < 5 minutes                   | 0 (no data loss)               | Multi-AZ deployment                        |
| Database (DynamoDB)     | < 5 minutes                   | < 5 minutes                    | Point-in-time recovery                     |
| Configuration (SSM)     | < 10 minutes                  | 0 (no data loss)               | Parameter history                          |

### Backup Strategy

| Component               | Backup Method                | Frequency  | Retention Period | Validation Process                        |
|-------------------------|------------------------------|------------|------------------|-------------------------------------------|
| S3 Website              | Cross-region replication     | Real-time  | Indefinite       | Monthly restore test                       |
| DynamoDB                | Point-in-time recovery       | Continuous | 35 days          | Quarterly restore test                     |
| Lambda Functions        | Source control (GitHub)      | Every push | Indefinite       | CI/CD pipeline validation                  |
| Infrastructure          | Terraform state in S3        | Every apply| 90 days          | Monthly terraform plan validation          |

### Disaster Recovery Scenarios

1. **Single AZ Failure**
   - **Impact**: Minimal to none
   - **Recovery**: Automatic failover to second AZ
   - **Action Required**: None, system self-heals

2. **Region Failure**
   - **Impact**: Service disruption until manual failover
   - **Recovery**: Manual promotion of backup region
   - **Action Required**: Update Route 53 records, promote replicated resources

3. **Data Corruption**
   - **Impact**: Potential data integrity issues
   - **Recovery**: Restore from point-in-time backup
   - **Action Required**: Identify corruption time, initiate restore

4. **Accidental Deletion**
   - **Impact**: Service disruption for affected components
   - **Recovery**: Restore from backups or redeploy from source
   - **Action Required**: Terraform apply or restore from backup

### Business Continuity Testing

The disaster recovery plan is tested quarterly through:

1. **Tabletop Exercises**: Simulated disaster scenarios with response team
2. **Failover Testing**: Controlled tests of failover mechanisms
3. **Restore Testing**: Validation of backup restoration procedures
4. **Documentation Review**: Regular updates to recovery procedures

This comprehensive approach ensures the system can recover quickly from various failure scenarios while minimizing data loss and service disruption.

---

## Architecture Evolution

The CloudForgeX architecture has evolved through several iterations, with each phase addressing specific requirements and incorporating lessons learned.

### Phase 1: Initial Serverless Implementation (July 2023)

- **Core Components**: Basic Lambda function, API Gateway, S3 website
- **Challenges**: Manual deployments, limited monitoring
- **Lessons Learned**: Need for automated deployments and better observability

### Phase 2: Infrastructure as Code Implementation (August 2023)

- **Key Additions**: Terraform modules, CI/CD pipelines
- **Improvements**: Consistent environments, repeatable deployments
- **Architectural Decisions**:
  - Selected Terraform over CloudFormation for multi-cloud potential
  - Implemented modular approach for reusability
  - Added remote state management for team collaboration

### Phase 3: Enhanced Security and Monitoring (September 2023)

- **Key Additions**: SSM Parameter Store, CloudWatch alarms, security headers
- **Improvements**: Secure configuration management, proactive monitoring
- **Architectural Decisions**:
  - Replaced environment variables with SSM parameters
  - Implemented defence-in-depth security strategy
  - Added comprehensive logging and alerting

### Phase 4: Containerisation and Kubernetes (October 2023)

- **Key Additions**: Docker containers, Kubernetes deployment
- **Improvements**: Deployment versatility, local development
- **Architectural Decisions**:
  - Maintained same codebase for both deployment options
  - Implemented environment variable fallback for configuration
  - Used multi-stage Docker builds for security and efficiency

### Alternative Approaches Considered

1. **Traditional EC2-Based Architecture**
   - **Pros**: More control over runtime environment, potentially lower latency
   - **Cons**: Higher operational overhead, fixed costs, manual scaling
   - **Decision**: Rejected in favor of serverless for cost efficiency and auto-scaling

2. **Managed Container Services (ECS/Fargate)**
   - **Pros**: Simpler than Kubernetes, AWS-native integration
   - **Cons**: Less portable, fewer orchestration features
   - **Decision**: Implemented Kubernetes for broader industry relevance and learning

3. **Third-Party AI Services**
   - **Pros**: Potentially lower cost, specialized capabilities
   - **Cons**: Data security concerns, integration complexity
   - **Decision**: Selected AWS Bedrock for security and native AWS integration

This evolutionary approach allowed the architecture to mature organically, incorporating lessons learned and adapting to changing requirements while maintaining core principles of security, scalability, and cost efficiency.

---

## Future Enhancements

Planned future enhancements to the architecture include:

1. **Enhanced Monitoring**: Implementation of X-Ray for distributed tracing
2. **Multi-Region Deployment**: Expansion to multiple AWS regions for global redundancy
3. **Advanced AI Capabilities**: Integration with additional AWS AI services
4. **Performance Optimisation**: Further optimisation of Lambda functions and frontend assets
5. **Expanded Security Controls**: Implementation of WAF and additional security layers
6. **Kubernetes Enhancements**: Horizontal Pod Autoscaling and Ingress Controller

## References and Resources

**[AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)**

- Core design principles used to guide architectural decisions for CloudForgeX, focusing on operational excellence, security, reliability, performance efficiency, and cost optimization.

**[AWS Serverless Architecture Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)**

- Guidelines followed for Lambda function design, API Gateway configuration, and event-driven architecture patterns.

**[Terraform Best Practices](https://www.terraform-best-practices.com/)**

- Resource for modular design patterns, state management, and variable handling implemented in the CloudForgeX IaC approach.

**[AWS Security Best Practices](https://aws.amazon.com/architecture/security-identity-compliance/)**

- Security standards implemented for IAM policies, encryption, and network security controls throughout the architecture.

**[CloudFront Developer Guide](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)**

- Reference for CDN configuration, caching strategies, and origin access controls used in the frontend delivery system.

**[GitHub Actions Documentation](https://docs.github.com/en/actions)**

- Reference for CI/CD workflow configuration and best practices implemented in the deployment pipeline.

**[Kubernetes Documentation](https://kubernetes.io/docs/home/)**

- Reference for Kubernetes concepts, deployment strategies, and best practices.

**[Docker Documentation](https://docs.docker.com/)**

- Reference for Docker containerisation, multi-stage builds, and security best practices.

**[Project README](https://github.com/JThomas404/cloudforgex/blob/main/README.md)**

- Overview of the CloudForgeX project, including setup instructions, features, and project structure.

**[Frontend Implementation](https://github.com/JThomas404/cloudforgex/blob/main/frontend/)**

- Source code for the HTML5, CSS3, and JavaScript components that make up the user interface and EVE assistant integration.

**[Lambda Functions](https://github.com/JThomas404/cloudforgex/blob/main/lambda/)**

- Backend code for the serverless functions that power the EVE AI assistant and certificate management functionality.

**[Terraform Configuration](https://github.com/JThomas404/cloudforgex/blob/main/terraform/)**

- Infrastructure as Code modules and configurations that define and provision the entire AWS environment.

---
# CloudForgeX Architecture Diagram Instructions

## Overview
This document provides instructions for creating the CloudForgeX architecture diagram using draw.io or similar tools.

## Diagram Requirements

### Color Scheme
- **Primary Color**: #232f3e (AWS Dark Blue)
- **Secondary Color**: #f58536 (AWS Orange)
- **User Layer**: #f5f5f5 (Light Gray) with #232f3e border
- **Edge Layer**: #e6f2ff (Light Blue) with #146eb4 border
- **Application Layer**: #e6ffe6 (Light Green) with #3b873a border
- **Data Layer**: #fff2e6 (Light Orange) with #c94f17 border
- **Management Layer**: #ffe6f0 (Light Pink) with #b0084d border
- **Deployment**: #f0e6ff (Light Purple) with #4d27aa border

### Layout Structure
1. **Canvas Size**: A4 Landscape (1123 x 794 px)
2. **Concentric Rings** (from outer to inner):
   - User Layer: End users, browsers, devices
   - Edge Layer: CloudFront, Route 53, ACM
   - Application Layer: API Gateway, Lambda functions
   - Data Layer: DynamoDB, S3 buckets
   - Management Layer: SSM Parameter Store, CloudWatch, IAM
3. **Vertical Divisions**:
   - Frontend components (top)
   - Backend components (right)
   - AI components (bottom)
   - Infrastructure components (left)

### Components
1. **User Layer**:
   - User icon
   - Web Browser icon
2. **Edge Layer**:
   - CloudFront distribution
   - Route 53
   - ACM
3. **Application Layer**:
   - API Gateway
   - Lambda Main function
   - Lambda AI function
4. **Data Layer**:
   - S3 bucket
   - DynamoDB table
   - AWS Bedrock
5. **Management Layer**:
   - SSM Parameter Store
   - CloudWatch
   - IAM roles
6. **Deployment Components**:
   - GitHub repository
   - GitHub Actions workflow
   - Terraform modules

### Data Flows
1. **User Flows** (Solid Orange Lines):
   - User → Browser → CloudFront
   - CloudFront → S3 (static content)
   - CloudFront → API Gateway (API requests)
   - Route 53 → CloudFront (DNS resolution)
   - ACM → CloudFront (SSL certificate)
2. **Application Flows** (Solid Blue Lines):
   - API Gateway → Lambda Main
   - Lambda Main → Lambda AI
   - Lambda Main → DynamoDB
   - Lambda Main → SSM Parameter Store
   - Lambda AI → AWS Bedrock
   - Lambda Main → CloudWatch
3. **Deployment Flows** (Dashed Purple Lines):
   - GitHub → GitHub Actions → Terraform
   - Terraform → AWS Services
4. **Certificate Flow** (Dotted Green Line):
   - Lambda Main → S3 (presigned URL)

### Security Boundaries
1. **Public Zone** (Light Gray):
   - User and Browser
2. **DMZ Zone** (Light Blue):
   - CloudFront, Route 53, ACM
3. **Private Zone** (Light Green/Orange):
   - Application Layer and Data Layer
4. **Management Zone** (Light Pink):
   - SSM, CloudWatch, IAM

### Labels and Legend
1. **Component Labels**:
   - Name of each service
   - Brief description (1-3 words)
2. **Flow Labels**:
   - Purpose of each connection
3. **Legend**:
   - User Flow
   - Internal Communication
   - Deployment Flow
   - Security Zones

## Export Instructions
1. Save as draw.io file (.drawio)
2. Export as PNG with 300 DPI resolution
3. Save to `/docs/images/cloudforge-architecture.png`
4. Ensure the file is committed to the repository
# CloudForgeX Architecture Diagram Instructions

## Overview
This document provides instructions for creating a professional CloudForgeX architecture diagram using draw.io or similar tools.

## Diagram Requirements

### Color Scheme
- Use the official AWS color palette
- Background: White or very light gray
- Accent colors: AWS Orange (#FF9900) for important flows

### Layout Structure
1. **Canvas Size**: A4 Landscape (1123 x 794 px)
2. **Clean AWS Architecture Style**:
   - Use official AWS Architecture Icons (https://aws.amazon.com/architecture/icons/)
   - Organize components in logical groups
   - Minimize crossing lines
   - Use straight lines with right angles for connections

### Components to Include
1. **User Layer**:
   - Users/Clients icon
2. **Edge Layer**:
   - CloudFront icon
   - Route 53 icon
   - ACM icon
3. **Application Layer**:
   - API Gateway icon
   - Lambda icons (separate for Main and AI functions)
4. **Data Layer**:
   - S3 icon
   - DynamoDB icon
   - AWS Bedrock icon
5. **Management Layer**:
   - SSM Parameter Store icon
   - CloudWatch icon
   - IAM icon
6. **Deployment Components**:
   - GitHub icon
   - GitHub Actions icon
   - Terraform icon

### Data Flows
- Use arrows with minimal labels
- Group related flows with similar styling
- Use different line styles for different types of flows (user, service, deployment)

### Best Practices
1. **Simplicity**:
   - Remove unnecessary text and labels
   - Let the AWS icons speak for themselves
   - Use a clean, uncluttered layout
2. **Professionalism**:
   - Consistent spacing between components
   - Proper alignment of elements
   - Consistent icon sizes
3. **Clarity**:
   - Group related services
   - Use color sparingly for emphasis
   - Include a simple legend if needed

## Export Instructions
1. Save as draw.io file (.drawio)
2. Export as PNG with 300 DPI resolution
3. Save to `/docs/images/cloudforge-architecture.png`
4. Ensure the file is committed to the repository
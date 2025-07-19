# CloudForgeX Architecture Diagram (Mermaid)

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
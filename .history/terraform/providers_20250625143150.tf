# Pinning the latest versions for the providers i think we will need. Advise on if i should include or remove any?

terraform {
  required_version = "~> 1.12.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.0.0"
    }

    http = {
      source  = "hashicorp/http"
      version = "3.5.0"
    }

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.37.1"
    }
  }
}


provider "aws" {
  region = "us-east-1"

  tags = var.tags
}


# Providers.tf:
# Pinning the latest versions for the providers i think we will need. Advise on if i should include or remove any?

terraform {
  required_version = "~> 1.12.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.0.0"
    }

    random = {
      source  = "hashicorp/random"
      version = "3.7.2"
    }

    http = {
      source  = "hashicorp/http"
      version = "3.5.0"
    }

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.37.1"
    }

    tls = {
      source  = "hashicorp/tls"
      version = "4.1.0"
    }

  }
}

provider "aws" {
  region = "us-east-1"
}

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

    tls = {
      source  = "hashicorp/tls"
      version = "4.1.0"
    }

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.37.1"
    }
  }
}

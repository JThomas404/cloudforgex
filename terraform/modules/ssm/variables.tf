variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "CloudForgeX"
}

variable "region" {
  description = "Default region for project resources"
  type        = string
  default     = "us-east-1"
}

variable "tags" {
  description = "Default tags for project"
  type        = map(string)
  default = {
    Project_Name = "CloudForgeX"
    Environment  = "Dev"
  }
}

variable "environment" {
  description = "Default deployment environment"
  type        = string
}

variable "allowed_origin" {
  description = "CORS allowed origin for the API"
  type        = string
}

variable "bedrock_model" {
  description = "Claude model to use for Bedrock"
  type        = string
}

variable "parameter_tier" {
  description = "SSM Parameter tier (free tier)"
  type        = string
}

variable "table_name" {
  description = "Name for the DynamoDB table for the project"
  type        = string
}

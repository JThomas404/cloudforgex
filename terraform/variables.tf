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

variable "aliases" {
  description = "Custom domain name(s) for the CloudFront distribution"
  type        = list(string)
  default     = ["www.jarredthomas.cloud", "jarredthomas.cloud"]
}

variable "domain_name" {
  description = "Domain to request a certificate for"
  type        = string
}

variable "sub_alt_names" {
  description = "Subject Alternative Names (SANs) for the certificate"
  type        = list(string)
  default     = ["*.jarredthomas.cloud", "jarredthomas.cloud"]
}

variable "lambda_function" {
  description = "Name of the Lambda Function"
  type        = string
  default     = "cfx-chatbot-lambda"
}

variable "runtime" {
  description = "Lambda runtime version"
  type        = string
  default     = "python3.11"
}

variable "handler" {
  description = "Lambda function handler"
  type        = string
  default     = "app.lambda_handler"
}

variable "environment_variables" {
  description = "Environment variables for Lambda"
  type        = map(string)
  default = {
    ALLOWED_ORIGIN = "https://www.jarredthomas.cloud"
  }
}

variable "allowed_origin" {
  description = "CORS allowed origin"
  type        = string
  default     = "https://www.jarredthomas.cloud"
}

variable "allowed_headers" {
  description = "CORS allowed headers"
  type        = string
  default     = "Content-Type,Authorization"
}

variable "allowed_methods" {
  description = "CORS allowed methods"
  type        = string
  default     = "POST,OPTIONS"
}

variable "api_name" {
  description = "Name of the API Gateway"
  type        = string
  default     = "cfx-chatbot-api"
}

variable "stage_name" {
  description = "API Gateway deployment stage"
  type        = string
  default     = "prod"
}

variable "table_name" {
  description = "Name for the DynamoDB table for the project"
  type        = string
  default     = "cfx-chatbot-logs"
}

variable "ttl_attribute" {
  description = "Name of the attribute that automatically deletes old records in the table"
  type        = string
  default     = "ttl"
}

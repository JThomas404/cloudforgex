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

variable "lambda_function" {
  description = "Name of the Lambda Function"
  type        = string
}

variable "lambda_function_arn" {
  description = "ARN of the Lambda function to integrate"
  type        = string
}

variable "api_name" {
  description = "Name of the API Gateway"
  type        = string
}

variable "stage_name" {
  description = "API Gateway deployment stage"
  type        = string
  default     = "prod"
}

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

variable "iam_role_arn" {
  description = "ARN of the IAM role for Lambda execution"
  type        = string
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

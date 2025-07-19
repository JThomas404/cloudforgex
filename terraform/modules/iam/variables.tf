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

variable "dynamodb_table_arn" {
  description = "ARN of the DynamoDB table for Lambda permissions"
  type        = string
}

variable "ssm_parameter_arns" {
  description = "ARNs of SSM parameters that Lambda need access to"
  type        = list(string)
}

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

variable "table_name" {
  description = "Name for the DynamoDB table for the project"
  type        = string
}

variable "ttl_attribute" {
  description = "Name of the attribute that automatically deletes old records in the table"
  type        = string
}

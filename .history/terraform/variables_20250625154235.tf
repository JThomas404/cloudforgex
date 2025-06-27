variable "region" {
  description = "Default region for project resources"
  type        = string
  default     = "us-east-1"
}

variable "tags" {
  description = "Default tags for project"
  type        = map(string)
  default = {
    Project_Name = var.project_name
    Environment  = "Dev"
  }
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "CloudForgeX"
}


# variables.tf

variable "region" {
  description = "Default region for project resources"
  type        = string
  default     = "us-east-1"
}

variable "tags" {
  description = "Default tags for project"
  type        = map(string)
  default = {
    Name        = "CloudForgeX"
    Environment = "Dev"
  }
}

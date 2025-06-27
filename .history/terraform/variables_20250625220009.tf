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

variable "index_document" {
  description = "Main page for web app"
  type        = string
  default     = "index.html"
}

variable "error_document" {
  description = "Error page for web app"
  type        = string
  default     = "error.html"
}

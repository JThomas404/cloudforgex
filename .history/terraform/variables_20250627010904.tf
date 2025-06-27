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

variable "aliases" {
  description = "Custom domain name(s) for the CloudFront distribution"
  type        = list(string)
  default     = ["www.jarredthomas.cloud"]
}

variable "domain_name" {
  description = "Domain to request a certificate for"
  type        = string
}

variable "sub_alt_names" {
  description = "Subject Alternative Names (SANs) for the certificate"
  type        = list(string)
  default     = ["*.jarredthomas.cloud"]
}

variable "s3_bucket_domain_name" {
  description = "The domain name of the S3 static website endpoint"
  type        = string
}

variable "acm_cert_arn" {
  description = "The domain name of the S3 static website endpoint"
  type        = string
  # default = not sure what to put here yet
}

variable "aliases" {
  description = "Custom domain name(s)"
  type        = string
  default     = "www.jarredthomas.cloud"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "CloudForgeX"
}

variable "tags" {
  description = "Default tags for project"
  type        = map(string)
  default = {
    Project_Name = "CloudForgeX"
    Environment  = "Dev"
  }
}

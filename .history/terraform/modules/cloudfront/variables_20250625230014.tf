variable "s3_bucket_domain_name" {
  description = "The domain name of the S3 static website endpoint (e.g., cloudforgex-xyz.s3-website-us-east-1.amazonaws.com)"
  type        = string
}

variable "acm_cert_arn" {
  description = "The ARN of the ACM SSL certificate to use with CloudFront (must be in us-east-1)"
  type        = string
}

variable "aliases" {
  description = "Custom domain name(s) for the CloudFront distribution"
  type        = list(string)
  default     = ["www.jarredthomas.cloud"]
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

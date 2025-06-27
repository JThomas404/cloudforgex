variable "s3_bucket_domain_name" {
  description = "The domain name of the S3 static website endpoint"
  type        = string
  # default = not sure what to put here
}

variable "acm_cert_arn" {
  description = "The domain name of the S3 static website endpoint"
  type        = string
  # default = not sure what to put here yet
}

variable "aliases" {
  description = "Custom domain name(s)"
  type        = string
  value       = "www.jarredthomas.cloud"
}

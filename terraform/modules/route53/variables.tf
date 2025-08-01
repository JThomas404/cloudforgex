variable "domain_name" {
  description = "Domain to request a certificate for the CloudForgeX project"
  type        = string
}

variable "domain_validation_options" {
  description = "Domain validation options from ACM certificate"
  type = map(object({
    domain_name           = string
    resource_record_name  = string
    resource_record_type  = string
    resource_record_value = string
  }))
  default = {}
}

variable "tags" {
  description = "Default tags for project"
  type        = map(string)
  default = {
    Project_Name = "CloudForgeX"
    Environment  = "Dev"
  }
}

variable "cloudfront_domain_name" {
  description = "Cloudfront distribution domain name"
  type        = string
}


variable "domain_name" {
  description = "Domain to request a certificate for"
  type        = string
}

variable "domain_validation_options" {
  description = "Domain validation options from ACM certificate"
  type = list(object({
    domain_name           = string
    resource_record_name  = string
    resource_record_type  = string
    resource_record_value = string
  }))

}

variable "sub_alt_names" {
  description = "Subject Alternative Names (SANs) for the certificate"
  type        = list(string)
  default     = ["*.jarredthomas.cloud"]
}


variable "tags" {
  description = "Default tags for project"
  type        = map(string)
  default = {
    Project_Name = "CloudForgeX"
    Environment  = "Dev"
  }
}

variable "domain_name" {
  description = "Domain to request a certificate for"
  type        = string
}

variable "sub_alt_names" {
  description = "Subject Alternative Names (SANs) for the certificate"
  type        = list(string)
  default     = ["*.jarredthomas.cloud"]
}

variable "validation_record_fqdns" {
  description = "FQDNs of validation records from Route53 module"
  type        = list(string)
}

variable "tags" {
  description = "Default tags for project"
  type        = map(string)
  default = {
    Project_Name = "CloudForgeX"
    Environment  = "Dev"
  }
}

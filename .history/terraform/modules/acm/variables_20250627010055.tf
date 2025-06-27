variable "domain_name" {
  description = "Domain to request a certificate for"
  type        = string
}

variable "sub_alt_names" {
  description = "Subject Alternative Names"
  type        = list(string)
  default     = ["*jarredthomas.cloud"]
}

variable "tags" {
  description = "Default tags for project"
  type        = map(string)
  default = {
    Project_Name = "CloudForgeX"
    Environment  = "Dev"
  }
}

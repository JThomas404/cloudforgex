variable "domain_name" {
  description = "The main domain to request a certificate for"
  type        = string
}

variable "sub_alt_names" {
  description = "Subject Alternative Names"
}

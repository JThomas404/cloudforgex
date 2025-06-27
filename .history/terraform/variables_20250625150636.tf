# variables.tf
# i think later we can add variable "variables_sub_cidr", "variables_sub_auto_ip", "acm_cert_arn", "r53_zone_id". You can also later advise on other outputs to add.


variable "region" {
  description = "Default region for project resources"
  type        = string
  default     = "us-east-1"
}

variable "tags" {
  description = "Default tags for project"
  type        = map(string)
  default = {
    Project_Name = var.project_name
    Environment  = "Dev"
  }
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = CloudForgeX
}

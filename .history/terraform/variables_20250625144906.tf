# variables.tf
# i think later we can add variable "variables_sub_cidr", "variables_sub_auto_ip". You can also later advise on other outputs to add.


variable "region" {
  description = "Default region for project resources"
  type        = string
  default     = "us-east-1"
}

variable "tags" {
  description = "Default tags for project"
  type        = map(string)
  default = {
    Name        = "CloudForgeX"
    Environment = "Dev"
  }
}

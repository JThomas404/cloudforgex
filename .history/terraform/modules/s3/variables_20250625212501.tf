variable "tags" {
  description = "Default tags for project"
  type        = map(string)
  default = {
    Project_Name = var.project_name
    Environment  = "Dev"
  }
}

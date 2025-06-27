variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "CloudForgeX"
}

variable "tags" {
  description = "Default tags for project"
  type        = map(string)
  default = {
    Project_Name = var.project_name
    Environment  = "Dev"
  }
}

variable "index_document" {
  description = "Main page for web app"
  type        = string
  default     = "index.html"
}

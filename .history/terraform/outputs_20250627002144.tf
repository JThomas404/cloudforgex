output "project_name" {
  description = "Name of the project"
  value       = var.project_name
}

output "s3_bucket_name" {
  value = module.s3_bucket.aws_s3_bucket
}

output "s3_static_site_url" {
  value = module.s3_bucket.s3_static_site_url
}

output "s3_bucket_domain_name" {
  description = "Domain name of the S3 static website endpoint"
  value       = module.s3_bucket.s3_static_site_url
}

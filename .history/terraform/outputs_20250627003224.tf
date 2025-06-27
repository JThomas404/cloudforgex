output "project_name" {
  description = "Name of the project"
  value       = var.project_name
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = module.s3_bucket.s3_bucket_name
}

output "s3_static_site_url" {
  description = "The S3 static website endpoint"
  value       = module.s3_bucket.s3_static_site_url
}

output "s3_bucket_domain_name" {
  description = "S3 website domain name for use with CloudFront"
  value       = module.s3_bucket.s3_static_site_url
}

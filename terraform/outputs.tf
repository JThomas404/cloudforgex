output "project_name" {
  description = "Name of the project"
  value       = var.project_name
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = module.s3_bucket.s3_bucket_name
}

output "s3_bucket_domain_name" {
  description = "S3 bucket domain name for CloudFront"
  value       = module.s3_bucket.s3_bucket_domain_name
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = module.cloudfront.distribution_domain_name
}

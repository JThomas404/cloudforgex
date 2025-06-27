output "s3_bucket_name" {
  description = "CloudForgeX web application bucket name"
  value       = aws_s3_bucket.cfx_s3_bucket.id
}

output "s3_bucket_arn" {
  description = "CloudForgeX web application bucket ARN"
  value       = aws_s3_bucket.cfx_s3_bucket.arn
}

output "s3_bucket_domain_name" {
  description = "S3 bucket domain name for CloudFront"
  value       = aws_s3_bucket.cfx_s3_bucket.bucket_domain_name
}

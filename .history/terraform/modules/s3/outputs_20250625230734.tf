output "s3_bucket_name" {
  description = "The CloudForgeX web application bucket name"
  value       = aws_s3_bucket.cfx_s3_bucket.name
}

output "s3_bucket_arn" {
  description = "The CloudForgeX web application bucket ARN"
  value       = aws_s3_bucket.cfx_s3_bucket.arn
}

output "s3_static_site_url" {
  description = "The public URL of the static website hosted on S3"
  value       = "http://${aws_s3_bucket.cfx_s3_bucket.bucket}.s3-website-${var.region}.amazonaws.com"
}

output "s3_bucket_domain_name" {
  description = "The S3 static website endpoint"
  value       = aws_s3_bucket.cfx_s3_bucket.website_endpoint
}

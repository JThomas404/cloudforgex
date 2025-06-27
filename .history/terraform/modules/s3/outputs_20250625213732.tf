output "s3_bucket_name" {
  description = "The CloudForgeX web application bucket name"
  value       = aws_s3_bucket.cfx_s3_bucket.arn
}

output "s3_bucket_arn" {
  description = "The CloudForgeX web application bucket ARN"
  value       = aws_s3_bucket.cfx_s3_bucket.arn
}


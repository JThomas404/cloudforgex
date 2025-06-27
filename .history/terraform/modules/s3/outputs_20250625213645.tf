output "s3_bucket_name" {
  description = "The CloudForgeX web application bucket"
  value       = aws_s3_bucket.cfx_s3_bucket.arn
}

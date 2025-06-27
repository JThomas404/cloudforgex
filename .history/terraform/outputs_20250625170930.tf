output "project_name" {
  description = "Name of the project"
  value       = var.project_name
}

output "s3_bucket_name" {
  description = "The CloudForgeX web application bucket"
  value       = aws_s3_bucket.cfx_s3_bucket.arn
}

output "s3_static_site_url" {
  description = "The public URL of the static website hosted on S3"
  value       = "http://${aws_s3_bucket.cfx_s3_bucket}.s3-website-${var.region}.amazonaws.com"
}

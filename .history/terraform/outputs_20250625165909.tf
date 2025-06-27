output "project_name" {
  description = "Name of the project"
  value       = var.project_name
}

output "s3_static_site_url" {
  value       = "http://${aws_s3_bucket.ctdc-s3-bucket.bucket}.s3-website-${var.region}.amazonaws.com"
  description = "The public URL of the static website hosted on S3"
}

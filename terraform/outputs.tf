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

output "lambda_function_name" {
  description = "Name of the Lambda function"
  value       = module.lambda.lambda_function_name
}

output "lambda_function_arn" {
  description = "ARN of the Lambda function"
  value       = module.lambda.lambda_function_arn
}

output "api_gateway_url" {
  description = "API Gateway endpoint URL"
  value       = module.api_gateway.rest_api_url
}

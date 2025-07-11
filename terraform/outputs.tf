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
output "iam_role_name" {
  description = "Name of the IAM role"
  value       = module.iam.iam_role_name
}

output "iam_role_arn" {
  description = "ARN of the IAM role"
  value       = module.iam.iam_role_arn
}
output "lambda_function_name" {
  description = "Name of the Lambda function"
  value       = module.lambda.lambda_function_name
}

output "lambda_function_arn" {
  description = "ARN of the Lambda function"
  value       = module.lambda.lambda_function_arn
}

output "cloudwatch_dashboard_url" {
  description = "Direct link to CloudWatch Dashboard"
  value       = module.cloudwatch.dashboard_url
}

output "cloudwatch_dashboard_name" {
  description = "Name of the CloudWatch Dashboard"
  value       = module.cloudwatch.dashboard_name
}

output "acm_certificate_arn" {
  description = "ARN of the SSL certificate"
  value       = module.acm_certificate.acm_cert_arn
}

output "route53_zone_id" {
  description = "Route53 hosted zone ID"
  value       = module.route53.route53_zone_id
}

output "dynamodb_table_name" {
  description = "Name of the DynamoDB table"
  value       = module.dynamodb.dynamodb_table_name
}

output "dynamodb_table_arn" {
  description = "ARN of the DynamoDB table"
  value       = module.dynamodb.dynamodb_table_arn
}

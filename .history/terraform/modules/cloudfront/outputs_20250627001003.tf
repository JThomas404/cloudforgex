output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.cfx_distribution.id
}

output "cloudfront_domain_name" {
  description = "CloudFront domain name"
  value       = aws_cloudfront_distribution.cfx_distribution.domain_name
}

output "cloudfront_distribution_domain" {
  description = "The CloudFront domain to access the static website"
  value       = aws_cloudfront_distribution.cfx_distribution.domain_name
}

output "cloudfront_distribution_id" {
  description = "The ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.cfx_distribution.id
}

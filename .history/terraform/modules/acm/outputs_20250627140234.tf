output "acm_cert_arn" {
  description = "ARN of the validated ACM Certificate"
  value       = aws_acm_certificate_validation.cfx_cert_validation.certificate_arn
}

output "route53_zone_id" {
  description = "Route 53 Hosted Zone ID"
  value       = data.aws_route53_zone.cfx_r53_zone.zone_id
}

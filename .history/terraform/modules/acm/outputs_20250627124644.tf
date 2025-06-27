output "acm_cert_arn" {
  description = "ARN of the ACM Certificate"
  value       = aws_acm_certificate.cfx_acm_certificate.arn
}

output "route53_zone_id" {
  description = "ID of the Route53 Zone"
  value       = aws_route53_zone.cfx_r53_zone.zone_id
}

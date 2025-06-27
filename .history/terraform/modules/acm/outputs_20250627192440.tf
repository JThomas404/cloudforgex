output "acm_cert_arn" {
  description = "ARN of the validated ACM Certificate"
  value       = aws_acm_certificate_validation.cfx_cert_validation.certificate_arn
}

output "domain_validation_options" {
  description = "Domain validation options for Route53"
  value       = aws_acm_certificate.cfx_acm_certificate.domain_validation_options
}

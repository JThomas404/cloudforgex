output "acm_cert_arn" {
  description = "ARN of the validated ACM Certificate"
  value       = aws_acm_certificate_validation.cfx_cert_validation.certificate_arn
}

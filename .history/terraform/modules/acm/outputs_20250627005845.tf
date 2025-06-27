output "acm_cert_arn" {
  description = "ARN of the ACM Certificate"
  value       = aws_acm_certificate.cfx_acm_certification.arn
}

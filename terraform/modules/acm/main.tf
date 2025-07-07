resource "aws_acm_certificate" "cfx_acm_certificate" {
  domain_name       = var.domain_name
  validation_method = "DNS"

  subject_alternative_names = var.sub_alt_names

  lifecycle {
    create_before_destroy = true
  }

  tags = var.tags
}

resource "aws_acm_certificate_validation" "cfx_cert_validation" {
  certificate_arn         = aws_acm_certificate.cfx_acm_certificate.arn
  validation_record_fqdns = var.validation_record_fqdns

  timeouts {
    create = "10m"
  }
}

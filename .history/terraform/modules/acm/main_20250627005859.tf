resource "aws_acm_certification" "cfx_acm_cert" {
  domain_name       = var.domain_name
  validation_method = "DNS"

  subject_alternative_names = var.sub_alt_names

  lifecycle {
    create_before_destroy = true
  }

  tags = var.tags
}

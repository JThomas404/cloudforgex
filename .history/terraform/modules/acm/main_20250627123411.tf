resource "aws_acm_certificate" "cfx_acm_certificate" {

  domain_name       = var.domain_name
  validation_method = "DNS"

  subject_alternative_names = var.sub_alt_names

  lifecycle {
    create_before_destroy = true
  }

  tags = var.tags
}

data "aws_route53_zone" "cfx_r53_zone" {
  name         = var.domain_name
  private_zone = false
}

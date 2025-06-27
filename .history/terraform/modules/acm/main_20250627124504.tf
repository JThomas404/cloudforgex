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

resource "aws_route53_record" "cert_validatation" {
  for_each = {
    for data_val_opt in aws_acm_certificate.cfx_acm_certificate.domain_validation_options : data_val_opt.domain_name => {
      name   = data_val_opt.resource_record_name
      type   = data_val_opt.resource_record_type
      record = data_val_opt.resource_record_value
    }
  }

  zone_id = data.aws_route53_zone.cfx_r53_zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 330
}

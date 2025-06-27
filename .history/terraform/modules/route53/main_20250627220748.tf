data "aws_route53_zone" "cfx_r53_zone" {
  name         = var.domain_name
  private_zone = false
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for data_val_opt in var.domain_validation_options : data_val_opt.domain_name => {
      name   = data_val_opt.resource_record_name
      type   = data_val_opt.resource_record_type
      record = data_val_opt.resource_record_value
    }
  }

  zone_id         = data.aws_route53_zone.cfx_r53_zone.zone_id
  name            = each.value.name
  type            = each.value.type
  records         = [each.value.record]
  ttl             = 330
  allow_overwrite = true
}

resource "aws_route53_record" "www_alias" {
  zone_id = data.aws_route53_zone.cfx_r53_zone.zone.id
  name    = "www"
  type    = "A"

  alias {
    name                   = var.cloudfront_domain_name
    zone_id                = "Z2FDTNDATAQYW2"
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "apex_alias" {
  zone_id = data.aws_route53_zone.cfx_r53_zone.zone.id
  name    = ""
  type    = "A"

  alias {
    name                   = var.cloudfront_domain_name
    zone_id                = "Z2FDTNDATAQYW2"
    evaluate_target_health = false
  }
}

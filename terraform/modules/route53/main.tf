data "aws_route53_zone" "cfx_r53_zone" {
  name         = var.domain_name
  private_zone = false
}

resource "aws_route53_record" "cert_validation" {
  for_each = var.domain_validation_options

  zone_id         = data.aws_route53_zone.cfx_r53_zone.zone_id
  name            = each.value.resource_record_name
  type            = each.value.resource_record_type
  records         = [each.value.resource_record_value]
  ttl             = 330
  allow_overwrite = true
}

resource "aws_route53_record" "www_alias" {
  zone_id = data.aws_route53_zone.cfx_r53_zone.zone_id
  name    = "www"
  type    = "A"

  alias {
    name                   = var.cloudfront_domain_name
    zone_id                = "Z2FDTNDATAQYW2"
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "apex_alias" {
  zone_id = data.aws_route53_zone.cfx_r53_zone.zone_id
  name    = ""
  type    = "A"

  alias {
    name                   = var.cloudfront_domain_name
    zone_id                = "Z2FDTNDATAQYW2"
    evaluate_target_health = false
  }
}

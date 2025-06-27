module "s3_bucket" {
  source = "./modules/s3"

  region                      = var.region
  tags                        = var.tags
  cloudfront_distribution_arn = module.cloudfront.distribution_arn
}

module "acm_certificate" {
  source = "./modules/acm"

  domain_name             = var.domain_name
  sub_alt_names           = var.sub_alt_names
  validation_record_fqdns = module.route53.validation_record_fqdns
  tags                    = var.tags
}

module "route53" {
  source = "./modules/route53"

  domain_name               = var.domain_name
  domain_validation_options = module.acm_certificate.domain_validation_options
  cloudfront_domain_name    = module.cloudfront.distribution_domain_name
  tags                      = var.tags
}



module "cloudfront" {
  source = "./modules/cloudfront"

  s3_bucket_domain_name = module.s3_bucket.s3_bucket_domain_name
  s3_bucket_arn         = module.s3_bucket.s3_bucket_arn
  acm_cert_arn          = module.acm_certificate.acm_cert_arn

  aliases = var.aliases
  tags    = var.tags
}

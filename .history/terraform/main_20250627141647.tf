module "s3_bucket" {
  source = "./modules/s3"

  region = var.region
  tags   = var.tags
}

module "cloudfront" {
  source = "./modules/cloudfront"

  s3_bucket_domain_name = module.s3_bucket.s3_bucket_domain_name
  s3_bucket_arn         = module.s3_bucket.s3_bucket_arn
  acm_cert_arn          = module.acm_certificate.acm_cert_arn

  aliases = var.aliases
  tags    = var.tags
}

module "acm_certificate" {
  source = "./modules/acm"

  domain_name   = var.domain_name
  sub_alt_names = var.sub_alt_names
  tags          = var.tags
}

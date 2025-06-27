module "s3_bucket" {
  source = "./modules/s3"

  region         = var.region
  tags           = var.tags
  index_document = var.index_document
  error_document = var.error_document
}

module "cloudfront" {
  source = "./modules/cloudfront"

  s3_bucket_domain_name = module.s3_bucket.s3_static_site_url
  acm_cert_arn          = module.acm_certificate.acm_cert_arn

  aliases      = var.aliases
  project_name = var.project_name
  tags         = var.tags
}

module "acm_certificate" {
  source = "./modules/acm"

  domain_name   = var.domain_name
  sub_alt_names = var.sub_alt_names
  tags          = var.tags
}

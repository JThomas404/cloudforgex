module "s3_bucket" {
  source = "./modules/s3"

  region         = var.region
  tags           = var.tags
  index_document = var.index_document
  error_document = var.error_document
}

locals {
  s3_domain_name = module.s3_bucket.s3_bucket_domain_name
}

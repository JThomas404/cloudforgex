provider "aws" {
  region = var.region
}

resource "random_id" "s3_bucket_suffix" {
  byte_length = 8
}

module "cfx_s3_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "5.0.0"

  bucket        = "cloudforgex-${random_id.s3_bucket_suffix.hex}"
  force_destroy = true
  region        = var.region

  tags = var.tags
}

resource "aws_s3_bucket_website_configuration" "example" {
  bucket = "module.cfx_s3_bucket.cloudforgex-${random_id.s3_bucket_suffix.hex}".id

  index_document {
    suffix = "index.html"
  }
}

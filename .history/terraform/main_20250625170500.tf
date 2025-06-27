provider "aws" {
  region = var.region
}

resource "random_id" "s3_bucket_suffix" {
  byte_length = 8
}

resource "aws_s3_bucket" "name" {
  bucket        = "cloudforgex-${random_id.s3_bucket_suffix.hex}"
  force_destroy = true
  region        = var.region

  tags = var.tags
}

resource "aws_s3_bucket_website_configuration" "example" {
  bucket = "cfx_s3_bucket.cloudforgex-${random_id.s3_bucket_suffix.hex}.id"

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_public_access_block" "disable_block_public" {
  bucket = module.cfx_s3_bucket.cloudforgex-${random_id.s3_bucket_suffix.hex}.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

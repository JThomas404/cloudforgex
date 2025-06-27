provider "aws" {
  region = var.region
}

resource "random_id" "s3_bucket_suffix" {
  byte_length = 8
}

resource "aws_s3_bucket" "cfx_s3_bucket" {
  bucket        = "cloudforgex-${random_id.s3_bucket_suffix.hex}"
  force_destroy = true

  tags = var.tags
}

resource "aws_s3_bucket_website_configuration" "example" {
  bucket = aws_s3_bucket.cfx_s3_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_public_access_block" "disable_block_public" {
  bucket = aws_s3_bucket.cfx_s3_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "random_id" "s3_bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "cfx_s3_bucket" {
  bucket        = "cloudforgex-${random_id.s3_bucket_suffix.hex}"
  force_destroy = true
  tags          = var.tags
}

resource "aws_s3_bucket_website_configuration" "web" {
  bucket = aws_s3_bucket.cfx_s3_bucket.id

  index_document {
    suffix = var.index_document
  }

  error_document {
    key = var.error_document
  }
}

resource "aws_s3_bucket_public_access_block" "web_access_block" {
  bucket = aws_s3_bucket.cfx_s3_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

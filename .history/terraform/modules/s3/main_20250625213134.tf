resource "random_id" "s3_bucket_suffix" {
  byte_length = 4
}

module "aws_s3_bucket" {
  source        = "terraform-aws-modules/s3-bucket/aws"
  version       = "5.0.0"
  bucket        = "cloudforgex-${random_id.s3_bucket_suffix.hex}"
  force_destroy = true

  website = {
    index_document = "index.html"
    error_document = "error.html"
  }

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  tags = var.tags
}

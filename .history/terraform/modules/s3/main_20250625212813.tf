resource "random_id" "s3_bucket_suffix" {
  byte_length = 4
}

module "aws_s3_bucket" {
  source        = "terraform-aws-modules/s3-bucket/aws"
  version       = "5.0.0"
  bucket        = "cloudforgex-${random_id.s3_bucket_suffix.hex}"
  force_destroy = true

  tags = var.tags
}

module "s3-bucket" {
  source        = "terraform-aws-modules/s3-bucket/aws"
  version       = "5.0.0"
  bucket        = "cloudforgex-${random_id.s3_bucket_suffix.hex}"
  force_destroy = true

  tags = var.tags
}

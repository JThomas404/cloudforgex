provider "aws" {
  region = var.region
}

resource "random_id" "s3_bucket_suffix" {
  byte_length = 8
}

module "s3-bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "5.0.0"
}

resource "aws_s3_bucket" "cfx_s3_bucket" {
  bucket = "cloudforgex-${random_id.s3_bucket_suffix.hex}"


  force_destroy = true

  tags = var.tags
}

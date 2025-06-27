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
  index_document {
    suffix = "index.html"
  }

  tags = var.tags
}


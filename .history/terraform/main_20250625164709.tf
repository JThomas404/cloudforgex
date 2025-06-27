provider "aws" {
  region = var.region
}

resource "random_id" "s3_bucket_suffix" {
  byte_length = 8
}

resource "aws_s3_bucket" "cfx_s3_bucket" {
  bucket = "cloudforgex-${random_id.s3_bucket_suffix.hex}"


  tags = var.tags
}

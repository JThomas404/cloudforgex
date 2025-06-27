resource "random_id" "s3_bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "cfx_s3_bucket" {
  bucket        = "cloudforgex-${random_id.s3_bucket_suffix.hex}"
  force_destroy = true
  tags          = var.tags
}

resource "aws_s3_bucket_public_access_block" "web_access_block" {
  bucket = aws_s3_bucket.cfx_s3_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "cfx_oac_policy" {
  bucket = aws_s3_bucket.cfx_s3_bucket.id

  policy = jsonencode({
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action = "s3:GetObject"
        Resource = "${aws_s3_bucket.cfx_s3_bucket.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn = var.cloudfront_distribution_arn"
          }
        }
      }
    ]
  })
}
resource "aws_cloudfront_distribution" "cfx_s3_distribution" {
  origin {
    domain_name = var.s3_bucket_domain_name
    origin_id   = "s3-${var.project_name}"
  }
}

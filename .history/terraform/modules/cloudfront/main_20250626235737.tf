resource "aws_cloudfront_distribution" "cfx_distribution" {
  origin {
    domain_name = var.s3_bucket_domain_name
    origin_id   = "S3-${var.project_name}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled             = true
  default_root_object = "index.html"

  aliases = var.aliases

  viewer_certificate {
    acm_certificate_arn      = var.acm_cert_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  default_cache_behaviour {
    allowed_methods = ["GET", "HEAD"]

  }

  tags = var.tags
}

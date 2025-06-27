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

}

# CloudFront Module for Health SuperApp

# CloudFront Origin Access Identity (OAI) for S3 bucket
resource "aws_cloudfront_origin_access_identity" "s3_oai" {
  comment = "OAI for S3 assets bucket"
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = var.s3_bucket_domain
    origin_id   = "S3-Assets-Bucket"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.s3_oai.cloudfront_access_identity_path
    }
  }

  origin {
    domain_name = var.alb_domain_name
    origin_id   = "ALB-Origin"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution for Health SuperApp"
  default_root_object = "index.html"

  # Default cache behavior for S3 assets
  default_cache_behavior {
    target_origin_id       = "S3-Assets-Bucket"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    compress               = true
    query_string           = false

    forwarded_values {
      query_string_values = []
      headers             = ["Origin"]
      cookies {
        forward = "none"
      }
    }
  }

  # Cache behavior for API (forward to ALB)
  ordered_cache_behavior {
    path_pattern           = "/api/*"
    target_origin_id       = "ALB-Origin"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    compress               = true
    query_string           = true

    forwarded_values {
      query_string = true
      headers      = ["Origin", "Authorization", "Content-Type"]
      cookies {
        forward = "none"
      }
    }
  }

  # Cache behavior for Admin Web (forward to ALB)
  ordered_cache_behavior {
    path_pattern           = "/admin/*"
    target_origin_id       = "ALB-Origin"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    compress               = true
    query_string           = true

    forwarded_values {
      query_string = true
      headers      = ["Origin"]
      cookies {
        forward = "none"
      }
    }
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
    # For custom domain, uncomment below and provide ACM ARN
    # acm_certificate_arn = var.ssl_certificate_arn
    # ssl_support_method = "sni-only"
    # minimum_protocol_version = "TLSv1.2_2021"
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-cloudfront"
  })
}

# Route 53 Record for CloudFront (if domain_name is provided)
resource "aws_route53_record" "app_dns" {
  count = var.domain_name != "" ? 1 : 0

  zone_id = data.aws_route53_zone.selected[0].zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

# Data source for Route 53 Zone
data "aws_route53_zone" "selected" {
  count        = var.domain_name != "" ? 1 : 0
  name         = var.domain_name
  private_zone = false
}


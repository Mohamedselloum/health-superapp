# CloudFront Module Outputs

output "distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.s3_distribution.id
}

output "domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.s3_distribution.domain_name
}

output "hosted_zone_id" {
  description = "Hosted zone ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
}

output "cloudfront_oai_arn" {
  description = "CloudFront Origin Access Identity ARN"
  value       = aws_cloudfront_origin_access_identity.s3_oai.iam_arn
}


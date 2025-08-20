# CloudFront Module Variables

variable "name_prefix" {
  description = "Name prefix for resources"
  type        = string
}

variable "alb_domain_name" {
  description = "Domain name of the Application Load Balancer"
  type        = string
}

variable "s3_bucket_domain" {
  description = "Domain name of the S3 assets bucket"
  type        = string
}

variable "ssl_certificate_arn" {
  description = "SSL certificate ARN for CloudFront"
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}


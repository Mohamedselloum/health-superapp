# S3 Module Variables

variable "name_prefix" {
  description = "Name prefix for resources"
  type        = string
}

variable "create_assets_bucket" {
  description = "Create S3 bucket for assets"
  type        = bool
  default     = true
}

variable "create_backups_bucket" {
  description = "Create S3 bucket for backups"
  type        = bool
  default     = true
}

variable "create_logs_bucket" {
  description = "Create S3 bucket for logs"
  type        = bool
  default     = true
}

variable "cloudfront_oai_arn" {
  description = "CloudFront Origin Access Identity ARN for S3 bucket access"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}


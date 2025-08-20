# S3 Module Outputs

output "assets_bucket_name" {
  description = "Name of the assets S3 bucket"
  value       = var.create_assets_bucket ? aws_s3_bucket.assets[0].bucket : null
}

output "assets_bucket_arn" {
  description = "ARN of the assets S3 bucket"
  value       = var.create_assets_bucket ? aws_s3_bucket.assets[0].arn : null
}

output "assets_bucket_domain_name" {
  description = "Domain name of the assets S3 bucket"
  value       = var.create_assets_bucket ? aws_s3_bucket.assets[0].bucket_regional_domain_name : null
}

output "backups_bucket_name" {
  description = "Name of the backups S3 bucket"
  value       = var.create_backups_bucket ? aws_s3_bucket.backups[0].bucket : null
}

output "backups_bucket_arn" {
  description = "ARN of the backups S3 bucket"
  value       = var.create_backups_bucket ? aws_s3_bucket.backups[0].arn : null
}

output "logs_bucket_name" {
  description = "Name of the logs S3 bucket"
  value       = var.create_logs_bucket ? aws_s3_bucket.logs[0].bucket : null
}

output "logs_bucket_arn" {
  description = "ARN of the logs S3 bucket"
  value       = var.create_logs_bucket ? aws_s3_bucket.logs[0].arn : null
}


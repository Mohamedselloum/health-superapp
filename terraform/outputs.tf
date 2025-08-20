# Health SuperApp - Terraform Outputs

# VPC Outputs
output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = module.vpc.vpc_cidr_block
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = module.vpc.private_subnet_ids
}

output "database_subnet_ids" {
  description = "IDs of the database subnets"
  value       = module.vpc.database_subnet_ids
}

# RDS Outputs
output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = module.rds.endpoint
  sensitive   = true
}

output "rds_port" {
  description = "RDS instance port"
  value       = module.rds.port
}

output "database_url" {
  description = "Database connection URL"
  value       = module.rds.database_url
  sensitive   = true
}

# Redis Outputs
output "redis_endpoint" {
  description = "Redis cluster endpoint"
  value       = module.redis.endpoint
  sensitive   = true
}

output "redis_port" {
  description = "Redis cluster port"
  value       = module.redis.port
}

output "redis_url" {
  description = "Redis connection URL"
  value       = module.redis.redis_url
  sensitive   = true
}

# ECS Outputs
output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = module.ecs.cluster_name
}

output "ecs_cluster_arn" {
  description = "ARN of the ECS cluster"
  value       = module.ecs.cluster_arn
}

output "backend_service_name" {
  description = "Name of the backend ECS service"
  value       = module.ecs.backend_service_name
}

output "admin_web_service_name" {
  description = "Name of the admin web ECS service"
  value       = module.ecs.admin_web_service_name
}

# Load Balancer Outputs
output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = module.ecs.alb_dns_name
}

output "alb_zone_id" {
  description = "Zone ID of the Application Load Balancer"
  value       = module.ecs.alb_zone_id
}

output "alb_arn" {
  description = "ARN of the Application Load Balancer"
  value       = module.ecs.alb_arn
}

# S3 Outputs
output "assets_bucket_name" {
  description = "Name of the assets S3 bucket"
  value       = module.s3.assets_bucket_name
}

output "assets_bucket_domain_name" {
  description = "Domain name of the assets S3 bucket"
  value       = module.s3.assets_bucket_domain_name
}

output "backups_bucket_name" {
  description = "Name of the backups S3 bucket"
  value       = module.s3.backups_bucket_name
}

output "logs_bucket_name" {
  description = "Name of the logs S3 bucket"
  value       = module.s3.logs_bucket_name
}

# CloudFront Outputs
output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = module.cloudfront.distribution_id
}

output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = module.cloudfront.domain_name
}

output "cloudfront_hosted_zone_id" {
  description = "Hosted zone ID of the CloudFront distribution"
  value       = module.cloudfront.hosted_zone_id
}

# Security Group Outputs
output "alb_security_group_id" {
  description = "ID of the ALB security group"
  value       = module.security_groups.alb_security_group_id
}

output "ecs_security_group_id" {
  description = "ID of the ECS security group"
  value       = module.security_groups.ecs_security_group_id
}

output "database_security_group_id" {
  description = "ID of the database security group"
  value       = module.security_groups.database_security_group_id
}

output "redis_security_group_id" {
  description = "ID of the Redis security group"
  value       = module.security_groups.redis_security_group_id
}

# Secrets Manager Outputs
output "database_secret_arn" {
  description = "ARN of the database secret"
  value       = module.secrets.database_secret_arn
  sensitive   = true
}

output "app_secrets_arn" {
  description = "ARN of the application secrets"
  value       = module.secrets.app_secrets_arn
  sensitive   = true
}

# Monitoring Outputs
output "sns_topic_arn" {
  description = "ARN of the SNS topic for alerts"
  value       = module.monitoring.sns_topic_arn
}

output "cloudwatch_log_group_name" {
  description = "Name of the CloudWatch log group"
  value       = module.monitoring.log_group_name
}

# Application URLs
output "application_url" {
  description = "URL to access the application"
  value       = var.domain_name != "" ? "https://${var.domain_name}" : "http://${module.ecs.alb_dns_name}"
}

output "admin_url" {
  description = "URL to access the admin interface"
  value       = var.domain_name != "" ? "https://${var.domain_name}/admin" : "http://${module.ecs.alb_dns_name}/admin"
}

output "api_url" {
  description = "URL to access the API"
  value       = var.domain_name != "" ? "https://${var.domain_name}/api" : "http://${module.ecs.alb_dns_name}/api"
}


# Health SuperApp - Terraform Variables

# General Configuration
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "health-superapp"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

# VPC Configuration
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]
}

variable "database_subnet_cidrs" {
  description = "CIDR blocks for database subnets"
  type        = list(string)
  default     = ["10.0.21.0/24", "10.0.22.0/24", "10.0.23.0/24"]
}

variable "enable_nat_gateway" {
  description = "Enable NAT Gateway for private subnets"
  type        = bool
  default     = true
}

variable "enable_vpn_gateway" {
  description = "Enable VPN Gateway"
  type        = bool
  default     = false
}

# RDS Configuration
variable "db_engine_version" {
  description = "PostgreSQL engine version"
  type        = string
  default     = "15.4"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Initial allocated storage in GB"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "Maximum allocated storage in GB"
  type        = number
  default     = 100
}

variable "database_name" {
  description = "Name of the database"
  type        = string
  default     = "health_superapp"
}

variable "database_username" {
  description = "Database master username"
  type        = string
  default     = "postgres"
}

variable "db_backup_retention_period" {
  description = "Database backup retention period in days"
  type        = number
  default     = 7
}

variable "db_backup_window" {
  description = "Database backup window"
  type        = string
  default     = "03:00-04:00"
}

variable "db_maintenance_window" {
  description = "Database maintenance window"
  type        = string
  default     = "sun:04:00-sun:05:00"
}

variable "db_performance_insights_enabled" {
  description = "Enable Performance Insights"
  type        = bool
  default     = true
}

variable "db_monitoring_interval" {
  description = "Enhanced monitoring interval in seconds"
  type        = number
  default     = 60
}

# Redis Configuration
variable "redis_node_type" {
  description = "ElastiCache Redis node type"
  type        = string
  default     = "cache.t3.micro"
}

variable "redis_num_cache_nodes" {
  description = "Number of cache nodes"
  type        = number
  default     = 1
}

variable "redis_parameter_group_name" {
  description = "Redis parameter group name"
  type        = string
  default     = "default.redis7"
}

variable "redis_engine_version" {
  description = "Redis engine version"
  type        = string
  default     = "7.0"
}

# ECS Configuration
variable "backend_image" {
  description = "Backend Docker image"
  type        = string
  default     = "health-superapp/backend:latest"
}

variable "admin_web_image" {
  description = "Admin web Docker image"
  type        = string
  default     = "health-superapp/admin-web:latest"
}

# Backend scaling configuration
variable "backend_desired_count" {
  description = "Desired number of backend tasks"
  type        = number
  default     = 2
}

variable "backend_min_capacity" {
  description = "Minimum backend capacity"
  type        = number
  default     = 1
}

variable "backend_max_capacity" {
  description = "Maximum backend capacity"
  type        = number
  default     = 10
}

# Admin web scaling configuration
variable "admin_web_desired_count" {
  description = "Desired number of admin web tasks"
  type        = number
  default     = 2
}

variable "admin_web_min_capacity" {
  description = "Minimum admin web capacity"
  type        = number
  default     = 1
}

variable "admin_web_max_capacity" {
  description = "Maximum admin web capacity"
  type        = number
  default     = 5
}

# S3 Configuration
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

# CloudFront Configuration
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

# Application Secrets
variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "openai_api_key" {
  description = "OpenAI API key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "stripe_secret_key" {
  description = "Stripe secret key"
  type        = string
  sensitive   = true
  default     = ""
}

# Environment Variables
variable "environment_variables" {
  description = "Environment variables for ECS tasks"
  type        = map(string)
  default     = {}
}

# Monitoring Configuration
variable "alert_email" {
  description = "Email address for alerts"
  type        = string
  default     = ""
}


# Health SuperApp - Main Terraform Configuration
# This configuration sets up a scalable, production-ready infrastructure on AWS

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1"
    }
  }
  
  # Backend configuration for state management
  backend "s3" {
    bucket         = "health-superapp-terraform-state"
    key            = "infrastructure/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "health-superapp-terraform-locks"
  }
}

# Configure AWS Provider
provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "Health SuperApp"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Owner       = "Health SuperApp Team"
    }
  }
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

# Local values
locals {
  name_prefix = "${var.project_name}-${var.environment}"
  
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
  
  # AZ configuration
  azs = slice(data.aws_availability_zones.available.names, 0, 3)
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"
  
  name_prefix = local.name_prefix
  cidr_block  = var.vpc_cidr
  azs         = local.azs
  
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  database_subnet_cidrs = var.database_subnet_cidrs
  
  enable_nat_gateway = var.enable_nat_gateway
  enable_vpn_gateway = var.enable_vpn_gateway
  
  tags = local.common_tags
}

# Security Groups Module
module "security_groups" {
  source = "./modules/security"
  
  name_prefix = local.name_prefix
  vpc_id      = module.vpc.vpc_id
  
  tags = local.common_tags
}

# RDS Module for PostgreSQL
module "rds" {
  source = "./modules/rds"
  
  name_prefix = local.name_prefix
  
  # Database configuration
  engine_version    = var.db_engine_version
  instance_class    = var.db_instance_class
  allocated_storage = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  
  database_name = var.database_name
  username      = var.database_username
  
  # Network configuration
  vpc_id                = module.vpc.vpc_id
  database_subnet_ids   = module.vpc.database_subnet_ids
  database_security_group_ids = [module.security_groups.database_security_group_id]
  
  # Backup configuration
  backup_retention_period = var.db_backup_retention_period
  backup_window          = var.db_backup_window
  maintenance_window     = var.db_maintenance_window
  
  # Performance and monitoring
  performance_insights_enabled = var.db_performance_insights_enabled
  monitoring_interval         = var.db_monitoring_interval
  
  tags = local.common_tags
}

# ElastiCache Redis Module
module "redis" {
  source = "./modules/redis"
  
  name_prefix = local.name_prefix
  
  # Redis configuration
  node_type           = var.redis_node_type
  num_cache_nodes     = var.redis_num_cache_nodes
  parameter_group_name = var.redis_parameter_group_name
  engine_version      = var.redis_engine_version
  
  # Network configuration
  vpc_id              = module.vpc.vpc_id
  subnet_ids          = module.vpc.private_subnet_ids
  security_group_ids  = [module.security_groups.redis_security_group_id]
  
  tags = local.common_tags
}

# ECS Cluster Module
module "ecs" {
  source = "./modules/ecs"
  
  name_prefix = local.name_prefix
  
  # Cluster configuration
  cluster_name = "${local.name_prefix}-cluster"
  
  # Network configuration
  vpc_id            = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  public_subnet_ids  = module.vpc.public_subnet_ids
  
  # Security groups
  alb_security_group_id = module.security_groups.alb_security_group_id
  ecs_security_group_id = module.security_groups.ecs_security_group_id
  
  # Database connection
  database_url = module.rds.database_url
  redis_url    = module.redis.redis_url
  
  # Application configuration
  backend_image    = var.backend_image
  admin_web_image  = var.admin_web_image
  
  # Scaling configuration
  backend_desired_count    = var.backend_desired_count
  backend_min_capacity     = var.backend_min_capacity
  backend_max_capacity     = var.backend_max_capacity
  
  admin_web_desired_count  = var.admin_web_desired_count
  admin_web_min_capacity   = var.admin_web_min_capacity
  admin_web_max_capacity   = var.admin_web_max_capacity
  
  # Environment variables
  environment_variables = var.environment_variables
  
  tags = local.common_tags
}

# S3 Buckets Module
module "s3" {
  source = "./modules/s3"
  
  name_prefix = local.name_prefix
  
  # Bucket configuration
  create_assets_bucket = var.create_assets_bucket
  create_backups_bucket = var.create_backups_bucket
  create_logs_bucket   = var.create_logs_bucket
  
  tags = local.common_tags
}

# CloudFront Module
module "cloudfront" {
  source = "./modules/cloudfront"
  
  name_prefix = local.name_prefix
  
  # Origin configuration
  alb_domain_name = module.ecs.alb_dns_name
  s3_bucket_domain = module.s3.assets_bucket_domain_name
  
  # SSL configuration
  ssl_certificate_arn = var.ssl_certificate_arn
  domain_name        = var.domain_name
  
  tags = local.common_tags
}

# Secrets Manager Module
module "secrets" {
  source = "./modules/secrets"
  
  name_prefix = local.name_prefix
  
  # Database secrets
  database_password = module.rds.database_password
  
  # Application secrets
  jwt_secret = var.jwt_secret
  openai_api_key = var.openai_api_key
  stripe_secret_key = var.stripe_secret_key
  
  tags = local.common_tags
}

# Monitoring Module
module "monitoring" {
  source = "./modules/monitoring"
  
  name_prefix = local.name_prefix
  
  # ECS cluster
  ecs_cluster_name = module.ecs.cluster_name
  
  # RDS instance
  rds_instance_id = module.rds.instance_id
  
  # Redis cluster
  redis_cluster_id = module.redis.cluster_id
  
  # ALB
  alb_arn_suffix = module.ecs.alb_arn_suffix
  
  # SNS topic for alerts
  alert_email = var.alert_email
  
  tags = local.common_tags
}


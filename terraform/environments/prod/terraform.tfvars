# Health SuperApp - Production Environment Configuration

# General Configuration
project_name = "health-superapp"
environment  = "prod"
aws_region   = "us-east-1"

# VPC Configuration
vpc_cidr = "10.0.0.0/16"

public_subnet_cidrs   = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
private_subnet_cidrs  = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]
database_subnet_cidrs = ["10.0.21.0/24", "10.0.22.0/24", "10.0.23.0/24"]

enable_nat_gateway = true
enable_vpn_gateway = false

# RDS Configuration - Production Settings
db_engine_version     = "15.4"
db_instance_class     = "db.r6g.large"
db_allocated_storage  = 100
db_max_allocated_storage = 1000

database_name     = "health_superapp_prod"
database_username = "postgres"

db_backup_retention_period = 30
db_backup_window          = "03:00-04:00"
db_maintenance_window     = "sun:04:00-sun:05:00"

db_performance_insights_enabled = true
db_monitoring_interval         = 60

# Redis Configuration - Production Settings
redis_node_type           = "cache.r6g.large"
redis_num_cache_nodes     = 3
redis_parameter_group_name = "default.redis7"
redis_engine_version      = "7.0"

# ECS Configuration - Production Scaling
backend_desired_count = 5
backend_min_capacity  = 3
backend_max_capacity  = 20

admin_web_desired_count = 3
admin_web_min_capacity  = 2
admin_web_max_capacity  = 10

# Docker Images - Production Tags
backend_image    = "health-superapp/backend:v1.0.0"
admin_web_image  = "health-superapp/admin-web:v1.0.0"

# S3 Configuration
create_assets_bucket  = true
create_backups_bucket = true
create_logs_bucket    = true

# Domain Configuration
domain_name = "healthsuperapp.com"
# ssl_certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012"

# Environment Variables for Production
environment_variables = {
  NODE_ENV = "production"
  LOG_LEVEL = "info"
  
  # API Configuration
  API_RATE_LIMIT = "1000"
  API_TIMEOUT = "30000"
  
  # Health Check Configuration
  HEALTH_CHECK_INTERVAL = "30"
  
  # Cache Configuration
  CACHE_TTL = "3600"
  
  # File Upload Configuration
  MAX_FILE_SIZE = "10485760"  # 10MB
  
  # Email Configuration
  SMTP_HOST = "smtp.ses.us-east-1.amazonaws.com"
  SMTP_PORT = "587"
  
  # Monitoring Configuration
  ENABLE_METRICS = "true"
  METRICS_PORT = "9090"
}

# Monitoring Configuration
alert_email = "alerts@healthsuperapp.com"

# Security Configuration (set via environment variables or AWS Secrets Manager)
# jwt_secret = "your-super-secure-jwt-secret-for-production"
# openai_api_key = "your-openai-api-key"
# stripe_secret_key = "your-stripe-secret-key"


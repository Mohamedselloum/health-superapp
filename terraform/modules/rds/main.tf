# RDS Module for Health SuperApp PostgreSQL Database

# Generate random password for database
resource "random_password" "database_password" {
  length  = 32
  special = true
}

# RDS Subnet Group (using the one created in VPC module)
data "aws_db_subnet_group" "database" {
  name = var.database_subnet_group_name
}

# RDS Parameter Group
resource "aws_db_parameter_group" "database" {
  family = "postgres15"
  name   = "${var.name_prefix}-postgres-params"

  # Performance optimizations for Health SuperApp
  parameter {
    name  = "shared_preload_libraries"
    value = "pg_stat_statements"
  }

  parameter {
    name  = "log_statement"
    value = "all"
  }

  parameter {
    name  = "log_min_duration_statement"
    value = "1000" # Log queries taking more than 1 second
  }

  parameter {
    name  = "max_connections"
    value = "200"
  }

  parameter {
    name  = "work_mem"
    value = "16384" # 16MB
  }

  parameter {
    name  = "maintenance_work_mem"
    value = "262144" # 256MB
  }

  parameter {
    name  = "effective_cache_size"
    value = "1048576" # 1GB
  }

  parameter {
    name  = "checkpoint_completion_target"
    value = "0.9"
  }

  parameter {
    name  = "wal_buffers"
    value = "16384" # 16MB
  }

  parameter {
    name  = "default_statistics_target"
    value = "100"
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-postgres-params"
  })
}

# RDS Option Group
resource "aws_db_option_group" "database" {
  name                     = "${var.name_prefix}-postgres-options"
  option_group_description = "Option group for Health SuperApp PostgreSQL"
  engine_name              = "postgres"
  major_engine_version     = "15"

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-postgres-options"
  })
}

# RDS Instance
resource "aws_db_instance" "database" {
  # Basic Configuration
  identifier = "${var.name_prefix}-postgres"
  engine     = "postgres"
  engine_version = var.engine_version

  # Instance Configuration
  instance_class    = var.instance_class
  allocated_storage = var.allocated_storage
  max_allocated_storage = var.max_allocated_storage
  storage_type      = "gp3"
  storage_encrypted = true

  # Database Configuration
  db_name  = var.database_name
  username = var.username
  password = random_password.database_password.result

  # Network Configuration
  db_subnet_group_name   = data.aws_db_subnet_group.database.name
  vpc_security_group_ids = var.database_security_group_ids
  publicly_accessible    = false

  # Parameter and Option Groups
  parameter_group_name = aws_db_parameter_group.database.name
  option_group_name    = aws_db_option_group.database.name

  # Backup Configuration
  backup_retention_period = var.backup_retention_period
  backup_window          = var.backup_window
  maintenance_window     = var.maintenance_window
  copy_tags_to_snapshot  = true
  delete_automated_backups = false

  # Performance and Monitoring
  performance_insights_enabled = var.performance_insights_enabled
  performance_insights_retention_period = var.performance_insights_enabled ? 7 : null
  monitoring_interval = var.monitoring_interval
  monitoring_role_arn = var.monitoring_interval > 0 ? aws_iam_role.rds_enhanced_monitoring[0].arn : null

  # Security
  deletion_protection = var.environment == "prod" ? true : false
  skip_final_snapshot = var.environment == "prod" ? false : true
  final_snapshot_identifier = var.environment == "prod" ? "${var.name_prefix}-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}" : null

  # Enable automated minor version upgrades
  auto_minor_version_upgrade = true

  # Multi-AZ for production
  multi_az = var.environment == "prod" ? true : false

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-postgres"
    Type = "Database"
  })

  lifecycle {
    ignore_changes = [
      password,
      final_snapshot_identifier,
    ]
  }
}

# IAM Role for Enhanced Monitoring
resource "aws_iam_role" "rds_enhanced_monitoring" {
  count = var.monitoring_interval > 0 ? 1 : 0
  name  = "${var.name_prefix}-rds-enhanced-monitoring"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-rds-enhanced-monitoring"
  })
}

# Attach policy to Enhanced Monitoring role
resource "aws_iam_role_policy_attachment" "rds_enhanced_monitoring" {
  count      = var.monitoring_interval > 0 ? 1 : 0
  role       = aws_iam_role.rds_enhanced_monitoring[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

# Read Replica for production (optional)
resource "aws_db_instance" "read_replica" {
  count = var.create_read_replica ? 1 : 0

  identifier = "${var.name_prefix}-postgres-read-replica"
  
  # Replica Configuration
  replicate_source_db = aws_db_instance.database.identifier
  instance_class      = var.read_replica_instance_class
  
  # Network Configuration
  publicly_accessible = false
  
  # Performance Insights
  performance_insights_enabled = var.performance_insights_enabled
  monitoring_interval = var.monitoring_interval
  monitoring_role_arn = var.monitoring_interval > 0 ? aws_iam_role.rds_enhanced_monitoring[0].arn : null

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-postgres-read-replica"
    Type = "Database-ReadReplica"
  })
}

# CloudWatch Alarms for Database Monitoring
resource "aws_cloudwatch_metric_alarm" "database_cpu" {
  alarm_name          = "${var.name_prefix}-database-cpu-utilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = "120"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors database CPU utilization"
  alarm_actions       = var.alarm_actions

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.database.id
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-database-cpu-alarm"
  })
}

resource "aws_cloudwatch_metric_alarm" "database_connections" {
  alarm_name          = "${var.name_prefix}-database-connections"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/RDS"
  period              = "120"
  statistic           = "Average"
  threshold           = "150"
  alarm_description   = "This metric monitors database connections"
  alarm_actions       = var.alarm_actions

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.database.id
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-database-connections-alarm"
  })
}


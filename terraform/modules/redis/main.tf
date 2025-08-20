# Redis Module for Health SuperApp ElastiCache

# ElastiCache Subnet Group (using the one created in VPC module)
data "aws_elasticache_subnet_group" "redis" {
  name = var.redis_subnet_group_name
}

# ElastiCache Parameter Group
resource "aws_elasticache_parameter_group" "redis" {
  name   = "${var.name_prefix}-redis-params"
  family = "redis${replace(var.engine_version, ".", "")}"

  # Performance optimizations for Health SuperApp
  parameter {
    name  = "maxmemory-policy"
    value = "allkeys-lru"
  }

  parameter {
    name  = "maxmemory-samples"
    value = "5"
  }

  parameter {
    name  = "timeout"
    value = "300"
  }

  parameter {
    name  = "tcp-keepalive"
    value = "300"
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-redis-params"
  })
}

# ElastiCache Replication Group (for high availability)
resource "aws_elasticache_replication_group" "redis" {
  replication_group_id          = "${var.name_prefix}-redis"
  description                   = "Redis cluster for Health SuperApp"
  engine                        = "redis"
  engine_version                = var.engine_version
  node_type                     = var.node_type
  num_cache_clusters            = var.num_cache_nodes
  port                          = 6379
  parameter_group_name          = aws_elasticache_parameter_group.redis.name
  subnet_group_name             = data.aws_elasticache_subnet_group.redis.name
  security_group_ids            = var.security_group_ids
  automatic_failover_enabled    = var.num_cache_nodes > 1 ? true : false
  snapshot_retention_limit      = 7
  snapshot_window               = "05:00-06:00"
  maintenance_window            = "sun:06:00-sun:07:00"
  at_rest_encryption_enabled    = true
  transit_encryption_enabled    = true

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-redis"
    Type = "Cache"
  })
}

# CloudWatch Alarms for Redis Monitoring
resource "aws_cloudwatch_metric_alarm" "redis_cpu" {
  alarm_name          = "${var.name_prefix}-redis-cpu-utilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ElastiCache"
  period              = "120"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors Redis CPU utilization"
  alarm_actions       = var.alarm_actions

  dimensions = {
    CacheClusterId = aws_elasticache_replication_group.redis.replication_group_id
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-redis-cpu-alarm"
  })
}

resource "aws_cloudwatch_metric_alarm" "redis_memory" {
  alarm_name          = "${var.name_prefix}-redis-memory-utilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "BytesUsedForCache"
  namespace           = "AWS/ElastiCache"
  period              = "120"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors Redis memory utilization"
  alarm_actions       = var.alarm_actions

  dimensions = {
    CacheClusterId = aws_elasticache_replication_group.redis.replication_group_id
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-redis-memory-alarm"
  })
}


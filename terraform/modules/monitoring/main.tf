# Monitoring Module for Health SuperApp

# CloudWatch Log Group for Backend
resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/${var.name_prefix}-backend"
  retention_in_days = 30

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-backend-logs"
  })
}

# CloudWatch Log Group for Admin Web
resource "aws_cloudwatch_log_group" "admin_web" {
  name              = "/ecs/${var.name_prefix}-admin-web"
  retention_in_days = 30

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-admin-web-logs"
  })
}

# SNS Topic for Alerts
resource "aws_sns_topic" "alerts" {
  name = "${var.name_prefix}-alerts"

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-alerts"
  })
}

# SNS Topic Subscription (Email)
resource "aws_sns_topic_subscription" "email_subscription" {
  count     = var.alert_email != "" ? 1 : 0
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# CloudWatch Alarms for ECS Services
resource "aws_cloudwatch_metric_alarm" "backend_cpu_utilization" {
  alarm_name          = "${var.name_prefix}-backend-cpu-utilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "Average CPU utilization of backend service is too high"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    ClusterName = var.ecs_cluster_name
    ServiceName = var.backend_service_name
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-backend-cpu-alarm"
  })
}

resource "aws_cloudwatch_metric_alarm" "admin_web_cpu_utilization" {
  alarm_name          = "${var.name_prefix}-admin-web-cpu-utilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "Average CPU utilization of admin web service is too high"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    ClusterName = var.ecs_cluster_name
    ServiceName = var.admin_web_service_name
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-admin-web-cpu-alarm"
  })
}

# CloudWatch Alarms for ALB
resource "aws_cloudwatch_metric_alarm" "alb_http_errors" {
  alarm_name          = "${var.name_prefix}-alb-http-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "HTTPCode_Target_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = "60"
  statistic           = "Sum"
  threshold           = "5"
  alarm_description   = "Too many 5XX errors from ALB targets"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    LoadBalancer = var.alb_arn_suffix
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-alb-5xx-alarm"
  })
}

resource "aws_cloudwatch_metric_alarm" "alb_latency" {
  alarm_name          = "${var.name_prefix}-alb-latency"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  period              = "300"
  statistic           = "Average"
  threshold           = "1"
  alarm_description   = "Average ALB target response time is too high"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    LoadBalancer = var.alb_arn_suffix
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-alb-latency-alarm"
  })
}

# CloudWatch Alarms for RDS (already defined in RDS module, but can add more here if needed)

# CloudWatch Alarms for Redis (already defined in Redis module, but can add more here if needed)

# CloudWatch Alarms for S3 (example for assets bucket)
resource "aws_cloudwatch_metric_alarm" "s3_bucket_size" {
  count               = var.assets_bucket_name != "" ? 1 : 0
  alarm_name          = "${var.name_prefix}-s3-assets-bucket-size"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "BucketSizeBytes"
  namespace           = "AWS/S3"
  period              = "86400" # 24 hours
  statistic           = "Average"
  threshold           = "107374182400" # 100 GB in bytes
  alarm_description   = "S3 assets bucket size is too large"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    BucketName = var.assets_bucket_name
    StorageType = "StandardStorage"
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-s3-assets-size-alarm"
  })
}


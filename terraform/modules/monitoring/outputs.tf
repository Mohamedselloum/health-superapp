# Monitoring Module Outputs

output "log_group_name" {
  description = "Name of the CloudWatch log group for backend"
  value       = aws_cloudwatch_log_group.backend.name
}

output "sns_topic_arn" {
  description = "ARN of the SNS topic for alerts"
  value       = aws_sns_topic.alerts.arn
}


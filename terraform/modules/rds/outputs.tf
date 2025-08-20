# RDS Module Outputs

output "instance_id" {
  description = "RDS instance ID"
  value       = aws_db_instance.database.id
}

output "instance_arn" {
  description = "RDS instance ARN"
  value       = aws_db_instance.database.arn
}

output "endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.database.endpoint
}

output "port" {
  description = "RDS instance port"
  value       = aws_db_instance.database.port
}

output "database_name" {
  description = "Database name"
  value       = aws_db_instance.database.db_name
}

output "username" {
  description = "Database master username"
  value       = aws_db_instance.database.username
  sensitive   = true
}

output "database_password" {
  description = "Database master password"
  value       = random_password.database_password.result
  sensitive   = true
}

output "database_url" {
  description = "Database connection URL"
  value       = "postgresql://${aws_db_instance.database.username}:${random_password.database_password.result}@${aws_db_instance.database.endpoint}:${aws_db_instance.database.port}/${aws_db_instance.database.db_name}"
  sensitive   = true
}

output "read_replica_endpoint" {
  description = "Read replica endpoint"
  value       = var.create_read_replica ? aws_db_instance.read_replica[0].endpoint : null
}

output "parameter_group_name" {
  description = "Database parameter group name"
  value       = aws_db_parameter_group.database.name
}

output "option_group_name" {
  description = "Database option group name"
  value       = aws_db_option_group.database.name
}


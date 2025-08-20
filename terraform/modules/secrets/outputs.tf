# Secrets Manager Module Outputs

output "database_secret_arn" {
  description = "ARN of the database password secret"
  value       = aws_secretsmanager_secret.database_password.arn
}

output "app_secrets_arn" {
  description = "ARN of the application secrets"
  value       = aws_secretsmanager_secret.app_secrets.arn
}


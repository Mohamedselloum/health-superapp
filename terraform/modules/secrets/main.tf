# Secrets Manager Module for Health SuperApp

# Database Password Secret
resource "aws_secretsmanager_secret" "database_password" {
  name        = "${var.name_prefix}-database-password"
  description = "Database master password for Health SuperApp"

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-database-password"
    Type = "Secret"
  })
}

resource "aws_secretsmanager_secret_version" "database_password_version" {
  secret_id     = aws_secretsmanager_secret.database_password.id
  secret_string = var.database_password
}

# Application Secrets
resource "aws_secretsmanager_secret" "app_secrets" {
  name        = "${var.name_prefix}-app-secrets"
  description = "Application secrets for Health SuperApp (JWT, API Keys)"

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-app-secrets"
    Type = "Secret"
  })
}

resource "aws_secretsmanager_secret_version" "app_secrets_version" {
  secret_id     = aws_secretsmanager_secret.app_secrets.id
  secret_string = jsonencode({
    JWT_SECRET        = var.jwt_secret
    OPENAI_API_KEY    = var.openai_api_key
    STRIPE_SECRET_KEY = var.stripe_secret_key
    PAYSERA_API_KEY   = var.paysera_api_key
    SUPABASE_URL      = var.supabase_url
    SUPABASE_ANON_KEY = var.supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY = var.supabase_service_role_key
    NEXTAUTH_SECRET   = var.nextauth_secret
  })
}


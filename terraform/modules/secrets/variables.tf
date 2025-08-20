# Secrets Manager Module Variables

variable "name_prefix" {
  description = "Name prefix for resources"
  type        = string
}

variable "database_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
}

variable "openai_api_key" {
  description = "OpenAI API key"
  type        = string
  sensitive   = true
}

variable "stripe_secret_key" {
  description = "Stripe secret key"
  type        = string
  sensitive   = true
}

variable "paysera_api_key" {
  description = "Paysera API key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "supabase_url" {
  description = "Supabase URL"
  type        = string
  sensitive   = true
  default     = ""
}

variable "supabase_anon_key" {
  description = "Supabase Anon Key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "supabase_service_role_key" {
  description = "Supabase Service Role Key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "nextauth_secret" {
  description = "NextAuth Secret"
  type        = string
  sensitive   = true
  default     = ""
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}


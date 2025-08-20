# Monitoring Module Variables

variable "name_prefix" {
  description = "Name prefix for resources"
  type        = string
}

variable "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  type        = string
}

variable "backend_service_name" {
  description = "Name of the backend ECS service"
  type        = string
}

variable "admin_web_service_name" {
  description = "Name of the admin web ECS service"
  type        = string
}

variable "alb_arn_suffix" {
  description = "ARN suffix of the Application Load Balancer"
  type        = string
}

variable "assets_bucket_name" {
  description = "Name of the assets S3 bucket"
  type        = string
  default     = ""
}

variable "alert_email" {
  description = "Email address for alerts"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}


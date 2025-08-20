# ECS Module Variables

variable "name_prefix" {
  description = "Name prefix for resources"
  type        = string
}

variable "cluster_name" {
  description = "Name of the ECS cluster"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "private_subnet_ids" {
  description = "IDs of the private subnets"
  type        = list(string)
}

variable "public_subnet_ids" {
  description = "IDs of the public subnets"
  type        = list(string)
}

variable "alb_security_group_id" {
  description = "ID of the ALB security group"
  type        = string
}

variable "ecs_security_group_id" {
  description = "ID of the ECS security group"
  type        = string
}

variable "database_url" {
  description = "Database connection URL"
  type        = string
  sensitive   = true
}

variable "redis_url" {
  description = "Redis connection URL"
  type        = string
  sensitive   = true
}

variable "backend_image" {
  description = "Backend Docker image"
  type        = string
}

variable "admin_web_image" {
  description = "Admin web Docker image"
  type        = string
}

variable "backend_desired_count" {
  description = "Desired number of backend tasks"
  type        = number
}

variable "backend_min_capacity" {
  description = "Minimum backend capacity"
  type        = number
}

variable "backend_max_capacity" {
  description = "Maximum backend capacity"
  type        = number
}

variable "admin_web_desired_count" {
  description = "Desired number of admin web tasks"
  type        = number
}

variable "admin_web_min_capacity" {
  description = "Minimum admin web capacity"
  type        = number
}

variable "admin_web_max_capacity" {
  description = "Maximum admin web capacity"
  type        = number
}

variable "environment_variables" {
  description = "Environment variables for ECS tasks"
  type        = map(string)
  default     = {}
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}


# Security Groups Module Variables

variable "name_prefix" {
  description = "Name prefix for resources"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where security groups will be created"
  type        = string
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = []
}

variable "bastion_allowed_cidrs" {
  description = "CIDR blocks allowed to access bastion host"
  type        = list(string)
  default     = ["10.0.0.0/8"] # Default to private networks only
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}


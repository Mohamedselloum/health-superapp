# Redis Module Variables

variable "name_prefix" {
  description = "Name prefix for resources"
  type        = string
}

variable "redis_subnet_group_name" {
  description = "Name of the Redis subnet group"
  type        = string
}

variable "node_type" {
  description = "ElastiCache Redis node type"
  type        = string
  default     = "cache.t3.micro"
}

variable "num_cache_nodes" {
  description = "Number of cache nodes"
  type        = number
  default     = 1
}

variable "parameter_group_name" {
  description = "Redis parameter group name"
  type        = string
  default     = "default.redis7"
}

variable "engine_version" {
  description = "Redis engine version"
  type        = string
  default     = "7.0"
}

variable "security_group_ids" {
  description = "List of security group IDs for the Redis cluster"
  type        = list(string)
}

variable "alarm_actions" {
  description = "List of ARNs to notify when alarm triggers"
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}


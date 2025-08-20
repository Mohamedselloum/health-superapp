# Redis Module Outputs

output "cluster_id" {
  description = "ElastiCache Redis cluster ID"
  value       = aws_elasticache_replication_group.redis.id
}

output "cluster_arn" {
  description = "ElastiCache Redis cluster ARN"
  value       = aws_elasticache_replication_group.redis.arn
}

output "endpoint" {
  description = "ElastiCache Redis cluster endpoint"
  value       = aws_elasticache_replication_group.redis.primary_endpoint_address
}

output "port" {
  description = "ElastiCache Redis cluster port"
  value       = aws_elasticache_replication_group.redis.port
}

output "redis_url" {
  description = "Redis connection URL"
  value       = "redis://${aws_elasticache_replication_group.redis.primary_endpoint_address}:${aws_elasticache_replication_group.redis.port}"
  sensitive   = true
}


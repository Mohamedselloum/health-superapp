# S3 Module for Health SuperApp

# S3 Bucket for Application Assets (e.g., images, videos)
resource "aws_s3_bucket" "assets" {
  count  = var.create_assets_bucket ? 1 : 0
  bucket = "${var.name_prefix}-assets"

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-assets"
    Type = "Assets"
  })
}

resource "aws_s3_bucket_acl" "assets_acl" {
  count  = var.create_assets_bucket ? 1 : 0
  bucket = aws_s3_bucket.assets[0].id
  acl    = "private"
}

resource "aws_s3_bucket_versioning" "assets_versioning" {
  count  = var.create_assets_bucket ? 1 : 0
  bucket = aws_s3_bucket.assets[0].id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "assets_encryption" {
  count  = var.create_assets_bucket ? 1 : 0
  bucket = aws_s3_bucket.assets[0].id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "assets_public_access_block" {
  count  = var.create_assets_bucket ? 1 : 0
  bucket = aws_s3_bucket.assets[0].id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 Bucket for Database Backups
resource "aws_s3_bucket" "backups" {
  count  = var.create_backups_bucket ? 1 : 0
  bucket = "${var.name_prefix}-backups"

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-backups"
    Type = "Backups"
  })
}

resource "aws_s3_bucket_acl" "backups_acl" {
  count  = var.create_backups_bucket ? 1 : 0
  bucket = aws_s3_bucket.backups[0].id
  acl    = "private"
}

resource "aws_s3_bucket_versioning" "backups_versioning" {
  count  = var.create_backups_bucket ? 1 : 0
  bucket = aws_s3_bucket.backups[0].id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "backups_encryption" {
  count  = var.create_backups_bucket ? 1 : 0
  bucket = aws_s3_bucket.backups[0].id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "backups_public_access_block" {
  count  = var.create_backups_bucket ? 1 : 0
  bucket = aws_s3_bucket.backups[0].id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 Bucket for Application Logs
resource "aws_s3_bucket" "logs" {
  count  = var.create_logs_bucket ? 1 : 0
  bucket = "${var.name_prefix}-logs"

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-logs"
    Type = "Logs"
  })
}

resource "aws_s3_bucket_acl" "logs_acl" {
  count  = var.create_logs_bucket ? 1 : 0
  bucket = aws_s3_bucket.logs[0].id
  acl    = "log-delivery-write"
}

resource "aws_s3_bucket_versioning" "logs_versioning" {
  count  = var.create_logs_bucket ? 1 : 0
  bucket = aws_s3_bucket.logs[0].id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "logs_encryption" {
  count  = var.create_logs_bucket ? 1 : 0
  bucket = aws_s3_bucket.logs[0].id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "logs_public_access_block" {
  count  = var.create_logs_bucket ? 1 : 0
  bucket = aws_s3_bucket.logs[0].id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 Bucket Policy for CloudFront OAI (for assets bucket)
resource "aws_s3_bucket_policy" "assets_policy" {
  count  = var.create_assets_bucket ? 1 : 0
  bucket = aws_s3_bucket.assets[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = {
          AWS = var.cloudfront_oai_arn
        }
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.assets[0].arn}/*"
      }
    ]
  })
}

# S3 Bucket Policy for CloudFront OAI (for logs bucket)
resource "aws_s3_bucket_policy" "logs_policy" {
  count  = var.create_logs_bucket ? 1 : 0
  bucket = aws_s3_bucket.logs[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = {
          Service = "logging.s3.amazonaws.com"
        }
        Action    = "s3:PutObject"
        Resource  = "${aws_s3_bucket.logs[0].arn}/*"
      }
    ]
  })
}


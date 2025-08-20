# ECS Module for Health SuperApp

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = var.cluster_name

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = merge(var.tags, {
    Name = var.cluster_name
  })
}

# IAM Role for ECS Task Execution
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.name_prefix}-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-ecs-task-execution-role"
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# IAM Role for ECS Tasks
resource "aws_iam_role" "ecs_task_role" {
  name = "${var.name_prefix}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-ecs-task-role"
  })
}

# Policy to allow ECS tasks to read secrets from Secrets Manager
resource "aws_iam_policy" "ecs_secrets_policy" {
  name        = "${var.name_prefix}-ecs-secrets-policy"
  description = "Allows ECS tasks to retrieve secrets from Secrets Manager"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = [
          "secretsmanager:GetSecretValue",
          "kms:Decrypt"
        ]
        Resource = "*" # Restrict this to specific secret ARNs in production
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_secrets_policy_attachment" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.ecs_secrets_policy.arn
}

# Application Load Balancer (ALB)
resource "aws_lb" "main" {
  name               = "${var.name_prefix}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_security_group_id]
  subnets            = var.public_subnet_ids

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-alb"
  })
}

resource "aws_lb_target_group" "backend" {
  name        = "${var.name_prefix}-backend-tg"
  port        = 3001
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path                = "/api/health"
    protocol            = "HTTP"
    matcher             = "200"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-backend-tg"
  })
}

resource "aws_lb_target_group" "admin_web" {
  name        = "${var.name_prefix}-admin-web-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path                = "/"
    protocol            = "HTTP"
    matcher             = "200"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-admin-web-tg"
  })
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.admin_web.arn
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-http-listener"
  })
}

resource "aws_lb_listener_rule" "backend_rule" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-backend-rule"
  })
}

# ECS Task Definitions
resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.name_prefix}-backend"
  cpu                      = "256"
  memory                   = "512"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name        = "backend"
      image       = var.backend_image
      cpu         = 256
      memory      = 512
      essential   = true
      portMappings = [
        {
          containerPort = 3001
          hostPort      = 3001
          protocol      = "tcp"
        }
      ]
      environment = [
        { name = "DATABASE_URL", value = var.database_url },
        { name = "REDIS_URL", value = var.redis_url },
        { name = "JWT_SECRET", value = "" }, # Use Secrets Manager for production
        { name = "OPENAI_API_KEY", value = "" }, # Use Secrets Manager for production
        { name = "STRIPE_SECRET_KEY", value = "" }, # Use Secrets Manager for production
        { name = "PAYSERA_API_KEY", value = "" }, # Use Secrets Manager for production
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/backend"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-backend-task"
  })
}

resource "aws_ecs_task_definition" "admin_web" {
  family                   = "${var.name_prefix}-admin-web"
  cpu                      = "256"
  memory                   = "512"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name        = "admin-web"
      image       = var.admin_web_image
      cpu         = 256
      memory      = 512
      essential   = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]
      environment = [
        { name = "NEXT_PUBLIC_API_URL", value = "http://${aws_lb.main.dns_name}/api" },
        { name = "NEXT_PUBLIC_SUPABASE_URL", value = "" }, # Use Secrets Manager for production
        { name = "NEXT_PUBLIC_SUPABASE_ANON_KEY", value = "" }, # Use Secrets Manager for production
        { name = "NEXTAUTH_SECRET", value = "" }, # Use Secrets Manager for production
        { name = "NEXTAUTH_URL", value = "http://${aws_lb.main.dns_name}" },
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/admin-web"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-admin-web-task"
  })
}

# ECS Services
resource "aws_ecs_service" "backend" {
  name            = "${var.name_prefix}-backend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = var.backend_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.private_subnet_ids
    security_groups = [var.ecs_security_group_id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "backend"
    container_port   = 3001
  }

  depends_on = [
    aws_lb_listener_rule.backend_rule,
    aws_lb_target_group.backend,
  ]

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-backend-service"
  })
}

resource "aws_ecs_service" "admin_web" {
  name            = "${var.name_prefix}-admin-web-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.admin_web.arn
  desired_count   = var.admin_web_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.private_subnet_ids
    security_groups = [var.ecs_security_group_id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.admin_web.arn
    container_name   = "admin-web"
    container_port   = 3000
  }

  depends_on = [
    aws_lb_listener.http,
    aws_lb_target_group.admin_web,
  ]

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-admin-web-service"
  })
}

# Auto Scaling for Backend Service
resource "aws_appautoscaling_target" "backend_target" {
  max_capacity       = var.backend_max_capacity
  min_capacity       = var.backend_min_capacity
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.backend.name}"
  scalable_dimension = "ecs:service:DesiredTaskCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "backend_cpu_scaling" {
  name               = "${var.name_prefix}-backend-cpu-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.backend_target.resource_id
  scalable_dimension = aws_appautoscaling_target.backend_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.backend_target.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    target_value = 70.0
  }
}

# Auto Scaling for Admin Web Service
resource "aws_appautoscaling_target" "admin_web_target" {
  max_capacity       = var.admin_web_max_capacity
  min_capacity       = var.admin_web_min_capacity
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.admin_web.name}"
  scalable_dimension = "ecs:service:DesiredTaskCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "admin_web_cpu_scaling" {
  name               = "${var.name_prefix}-admin-web-cpu-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.admin_web_target.resource_id
  scalable_dimension = aws_appautoscaling_target.admin_web_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.admin_web_target.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    target_value = 70.0
  }
}


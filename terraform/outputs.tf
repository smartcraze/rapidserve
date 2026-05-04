output "ecr_repository_url" {
  description = "ECR repo URL"
  value       = aws_ecr_repository.builder.repository_url
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.this.name
}

output "ecs_task_execution_role_arn" {
  description = "ECS task execution role ARN"
  value       = aws_iam_role.task_execution_role.arn
}

output "github_actions_policy_arn" {
  description = "Managed policy ARN for GitHub Actions to push image and run tasks"
  value       = aws_iam_policy.github_actions.arn
}

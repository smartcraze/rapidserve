Minimal Terraform for ECR + ECS cluster (no CloudWatch)

What this creates
- An ECR repository (name from `var.ecr_repo_name`)
- An ECS cluster (`${var.prefix}-cluster`)
- An IAM role for ECS task execution (attached `AmazonECSTaskExecutionRolePolicy`)
- An IAM policy intended for GitHub Actions to push images and call ECS APIs

Notes and next steps
- This setup intentionally omits VPC creation. Provide existing subnet IDs and a security group when running tasks (via GitHub Actions or your API).  
- The GitHub Actions role/provider is not created here. Attach the generated policy (`github_actions_policy_arn`) to the role you create for GitHub OIDC.
- The task definition can be registered from CI (GitHub Actions) so the image can be set dynamically after build.

Example: get outputs after `terraform apply` and use them in your workflow or API.

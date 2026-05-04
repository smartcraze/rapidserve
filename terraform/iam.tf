data "aws_iam_policy_document" "task_exec_assume" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "task_execution_role" {
  name               = "${var.prefix}-ecs-task-exec-role"
  assume_role_policy = data.aws_iam_policy_document.task_exec_assume.json
}

resource "aws_iam_role_policy_attachment" "task_exec_attach" {
  role       = aws_iam_role.task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# A minimal policy to attach to a GitHub Actions role that will allow ECR push + ECS actions.
data "aws_iam_policy_document" "github_actions_policy_doc" {
  statement {
    sid    = "ECRPush"
    effect = "Allow"
    actions = [
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload",
      "ecr:PutImage"
    ]
    resources = ["*"]
  }

  statement {
    sid    = "ECSControl"
    effect = "Allow"
    actions = [
      "ecs:RegisterTaskDefinition",
      "ecs:RunTask",
      "ecs:DescribeClusters",
      "ecs:DescribeTasks",
      "ecs:DescribeTaskDefinition"
    ]
    resources = ["*"]
  }

  statement {
    sid    = "PassRole"
    effect = "Allow"
    actions = ["iam:PassRole"]
    resources = [aws_iam_role.task_execution_role.arn]
  }
}

resource "aws_iam_policy" "github_actions" {
  name   = "${var.prefix}-github-actions-policy"
  policy = data.aws_iam_policy_document.github_actions_policy_doc.json
}

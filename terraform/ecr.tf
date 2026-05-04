resource "aws_ecr_repository" "builder" {
  name                 = var.ecr_repo_name
  image_tag_mutability = "MUTABLE"

  lifecycle {
    prevent_destroy = false
  }
}

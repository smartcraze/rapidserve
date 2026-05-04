variable "region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "prefix" {
  description = "Resource name prefix"
  type        = string
  default     = "rapidserve"
}

variable "ecr_repo_name" {
  description = "ECR repository name for builder image"
  type        = string
  default     = "builder"
}

variable "subnets" {
  description = "Optional list of subnet IDs for Fargate tasks (leave empty to supply at runtime)"
  type        = list(string)
  default     = []
}

variable "security_group_id" {
  description = "Optional security group ID for tasks (leave empty to supply at runtime)"
  type        = string
  default     = ""
}

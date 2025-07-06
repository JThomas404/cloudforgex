output "iam_role_name" {
  description = "Name of the IAM role"
  value       = aws_iam_role.cfx_lambda_execution_role.name
}

output "iam_role_arn" {
  description = "ARN of the IAM role"
  value       = aws_iam_role.cfx_lambda_execution_role.arn
}

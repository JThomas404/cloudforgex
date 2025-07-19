output "cfx_allowed_origin_name" {
  description = "SSM parameter name for the allowed origin"
  value       = aws_ssm_parameter.cfx_allowed_origin.name
}

output "cfx_allowed_origin_arn" {
  description = "SSM parameter ARN for the allowed origin for IAM permissions"
  value       = aws_ssm_parameter.cfx_allowed_origin.arn
}

output "cfx_bedrock_model_name" {
  description = "SSM parameter name for the Bedrock model identifier"
  value       = aws_ssm_parameter.cfx_bedrock_model.name
}

output "cfx_bedrock_model_arn" {
  description = "SSM parameter ARN for the Bedrock model identifier for IAM permissions"
  value       = aws_ssm_parameter.cfx_bedrock_model.arn
}

output "cfx_region_name" {
  description = "SSM parameter name for the AWS region override"
  value       = aws_ssm_parameter.cfx_region.name
}

output "cfx_region_arn" {
  description = "SSM parameter ARN for the AWS region override for IAM permissions"
  value       = aws_ssm_parameter.cfx_region.arn
}

output "cfx_dynamodb_table_name" {
  description = "SSM parameter name for the DynamoDB table"
  value       = aws_ssm_parameter.cfx_dynamodb_table.name
}

output "cfx_dynamodb_table_arn" {
  description = "SSM parameter ARN for the DynamoDB table for IAM permissions"
  value       = aws_ssm_parameter.cfx_dynamodb_table.arn
}

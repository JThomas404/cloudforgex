resource "aws_ssm_parameter" "cfx_allowed_origin" {
  name        = "/cfx/${var.environment}/allowed_origin"
  description = "CORS allowed origin for CloudForgeX API Gateway"
  type        = "String"
  value       = var.allowed_origin
  tier        = var.parameter_tier

  tags = var.tags
}

resource "aws_ssm_parameter" "cfx_bedrock_model" {
  name        = "/cfx/${var.environment}/bedrock_model"
  description = "Claude model identifier used for Bedrock AI integration"
  type        = "String"
  value       = var.bedrock_model
  tier        = var.parameter_tier

  tags = var.tags
}

resource "aws_ssm_parameter" "cfx_region" {
  name        = "/cfx/${var.environment}/region"
  description = "AWS region override for CloudForgeX services"
  type        = "String"
  value       = var.region
  tier        = var.parameter_tier

  tags = var.tags
}

resource "aws_ssm_parameter" "cfx_dynamodb_table" {
  name        = "/cfx/${var.environment}/dynamodb_table"
  description = "DynamoDB table name for CloudForgeX chat logs"
  type        = "String"
  value       = var.table_name
  tier        = var.parameter_tier

  tags = var.tags
}

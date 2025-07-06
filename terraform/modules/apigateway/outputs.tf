output "rest_api_id" {
  description = "The ID of the API Gateway REST API"
  value       = aws_api_gateway_rest_api.cfx_rest_api.id
}

output "rest_api_arn" {
  description = "The ARN of the API Gateway REST API"
  value       = aws_api_gateway_rest_api.cfx_rest_api.arn
}

output "rest_api_execution_arn" {
  description = "The execution ARN of the API Gateway"
  value       = aws_api_gateway_rest_api.cfx_rest_api.execution_arn
}

output "rest_api_url" {
  description = "Invoke URL for the deployed API Gateway"
  value       = "https://${aws_api_gateway_rest_api.cfx_rest_api.id}.execute-api.${var.region}.amazonaws.com/${aws_api_gateway_stage.cfx_stage.stage_name}"
}

output "resource_id" {
  description = "The ID of the /chat resource"
  value       = aws_api_gateway_resource.cfx_api_gw.id
}

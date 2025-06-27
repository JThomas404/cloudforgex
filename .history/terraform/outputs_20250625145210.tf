# outputs.tf

# i think later we can add output "vpc_id", "public_url", "vpc_information", "aws_s3_bucket", "aws_dynamodb", "api_invoke_url". You can also later advise on other outputs to add.

output "project_name" {
  description = "Name of the project"
  value       = "CloudForgeX"
}

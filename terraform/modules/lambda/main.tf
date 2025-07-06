locals {
  source_path = "${path.root}/../lambda"
}

data "archive_file" "cfx_lambda" {
  type        = "zip"
  source_dir  = local.source_path
  output_path = "${var.lambda_function}.zip"
}

resource "aws_lambda_function" "cfx_lambda_function" {
  function_name    = var.lambda_function
  role             = var.iam_role_arn
  handler          = var.handler
  runtime          = var.runtime
  filename         = data.archive_file.cfx_lambda.output_path
  source_code_hash = data.archive_file.cfx_lambda.output_base64sha256
  timeout          = 30
  memory_size      = 256

  environment {
    variables = var.environment_variables
  }

  tags = var.tags
}


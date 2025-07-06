resource "aws_iam_role" "cfx_lambda_execution_role" {
  name = "${var.project_name}-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy" "cfx_lambda_inline_policy" {
  name = "${var.project_name}-inline-policy"
  role = aws_iam_role.cfx_lambda_execution_role.id

  policy = jsonencode({

    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : ["bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"],
        "Effect" : "Allow",
        "Resource" : "*"
      },
      {
        "Action" : ["logs:CreateLogGroup",
          "logs:CreateLogStream",
        "logs:PutLogEvents"],
        "Effect" : "Allow",
        "Resource" : "*"
      }
    ]
  })
}





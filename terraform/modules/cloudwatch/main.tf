resource "aws_cloudwatch_dashboard" "cfx_cw_dashboard" {
  dashboard_name = "${var.project_name}-CW-Dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/Lambda", "Invocations", "FunctionName", var.lambda_function],
            ["AWS/Lambda", "Duration", "FunctionName", var.lambda_function],
            ["AWS/Lambda", "Errors", "FunctionName", var.lambda_function]
          ]
          view   = "timeSeries"
          region = var.region
          title  = "Lambda Function Performance"
          period = 300
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/ApiGateway", "Count", "ApiName", var.api_name],
            ["AWS/ApiGateway", "Latency", "ApiName", var.api_name],
            ["AWS/ApiGateway", "4XXError", "ApiName", var.api_name],
            ["AWS/ApiGateway", "5XXError", "ApiName", var.api_name]
          ]
          view   = "timeSeries"
          region = var.region
          title  = "API Gateway Performance"
          period = 300
        }
      }
    ]
  })
}

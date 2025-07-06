resource "aws_api_gateway_rest_api" "cfx_rest_api" {
  name        = var.api_name
  description = "Main API Gateway"
}

resource "aws_api_gateway_resource" "cfx_api_gw" {
  rest_api_id = aws_api_gateway_rest_api.cfx_rest_api.id
  parent_id   = aws_api_gateway_rest_api.cfx_rest_api.root_resource_id
  path_part   = "chat"
}

resource "aws_api_gateway_method" "cfx_post_method" {
  rest_api_id   = aws_api_gateway_rest_api.cfx_rest_api.id
  resource_id   = aws_api_gateway_resource.cfx_api_gw.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "cfx_post_integration" {
  rest_api_id             = aws_api_gateway_rest_api.cfx_rest_api.id
  resource_id             = aws_api_gateway_resource.cfx_api_gw.id
  http_method             = "POST"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${var.lambda_function_arn}/invocations"

}

resource "aws_lambda_permission" "cfx_lambda_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cfx_rest_api.execution_arn}/*/*"
}

resource "aws_api_gateway_deployment" "cfx_deployment" {
  depends_on = [
    aws_api_gateway_method.cfx_post_method,
    aws_api_gateway_method.cfx_options_method,
    aws_api_gateway_integration.cfx_post_integration,
    aws_api_gateway_integration.cfx_options_integration
  ]

  rest_api_id = aws_api_gateway_rest_api.cfx_rest_api.id

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "cfx_stage" {
  deployment_id = aws_api_gateway_deployment.cfx_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.cfx_rest_api.id
  stage_name    = var.stage_name
}


resource "aws_api_gateway_method" "cfx_options_method" {
  rest_api_id   = aws_api_gateway_rest_api.cfx_rest_api.id
  resource_id   = aws_api_gateway_resource.cfx_api_gw.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "cfx_options_integration" {
  rest_api_id = aws_api_gateway_rest_api.cfx_rest_api.id
  resource_id = aws_api_gateway_resource.cfx_api_gw.id
  http_method = aws_api_gateway_method.cfx_options_method.http_method
  type        = "MOCK"
}

resource "aws_api_gateway_method_response" "cfx_options_response" {
  rest_api_id = aws_api_gateway_rest_api.cfx_rest_api.id
  resource_id = aws_api_gateway_resource.cfx_api_gw.id
  http_method = aws_api_gateway_method.cfx_options_method.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "cfx_options_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.cfx_rest_api.id
  resource_id = aws_api_gateway_resource.cfx_api_gw.id
  http_method = aws_api_gateway_method.cfx_options_method.http_method
  status_code = aws_api_gateway_method_response.cfx_options_response.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'${var.allowed_headers}'"
    "method.response.header.Access-Control-Allow-Methods" = "'${var.allowed_methods}'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${var.allowed_origin}'"
  }
}

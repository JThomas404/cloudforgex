module "s3_bucket" {
  source = "./modules/s3"

  cloudfront_distribution_arn = module.cloudfront.distribution_arn
  region                      = var.region

  tags = var.tags
}

module "acm_certificate" {
  source = "./modules/acm"

  domain_name             = var.domain_name
  sub_alt_names           = var.sub_alt_names
  validation_record_fqdns = module.route53.validation_record_fqdns

  tags = var.tags
}

module "route53" {
  source = "./modules/route53"

  domain_name = var.domain_name
  domain_validation_options = {
    for dvo in module.acm_certificate.domain_validation_options :
    dvo.domain_name => dvo
  }
  cloudfront_domain_name = module.cloudfront.distribution_domain_name

  tags = var.tags
}

module "cloudfront" {
  source = "./modules/cloudfront"

  s3_bucket_domain_name = module.s3_bucket.s3_bucket_domain_name
  s3_bucket_arn         = module.s3_bucket.s3_bucket_arn
  acm_cert_arn          = module.acm_certificate.acm_cert_arn

  aliases = var.aliases
  tags    = var.tags
}

module "iam" {
  source = "./modules/iam"

  depends_on = [module.dynamodb, module.ssm]

  project_name       = var.project_name
  region             = var.region
  dynamodb_table_arn = module.dynamodb.dynamodb_table_arn
  ssm_parameter_arns = [
    module.ssm.cfx_allowed_origin_arn,
    module.ssm.cfx_bedrock_model_arn,
    module.ssm.cfx_region_arn,
    module.ssm.cfx_dynamodb_table_arn
  ]

  tags = var.tags
}


module "lambda" {
  source = "./modules/lambda"

  depends_on            = [module.iam]
  iam_role_arn          = module.iam.iam_role_arn
  lambda_function       = var.lambda_function
  handler               = var.handler
  runtime               = var.runtime
  environment_variables = var.environment_variables
  project_name          = var.project_name
  region                = var.region

  tags = var.tags
}

module "api_gateway" {
  source = "./modules/apigateway"

  project_name        = var.project_name
  region              = var.region
  lambda_function_arn = module.lambda.lambda_function_arn
  lambda_function     = module.lambda.lambda_function_name
  api_name            = var.api_name
  stage_name          = var.stage_name
  allowed_origin      = var.allowed_origin

  tags = var.tags
}

module "cloudwatch" {
  source = "./modules/cloudwatch"

  project_name    = var.project_name
  lambda_function = var.lambda_function
  api_name        = var.api_name
  region          = var.region

  tags = var.tags
}

module "dynamodb" {
  source = "./modules/dynamodb"

  project_name  = var.project_name
  table_name    = var.table_name
  ttl_attribute = var.ttl_attribute
  region        = var.region

  tags = var.tags
}

module "ssm" {
  source         = "./modules/ssm"
  project_name   = var.project_name
  table_name     = var.table_name
  environment    = var.environment
  allowed_origin = var.allowed_origin
  bedrock_model  = var.bedrock_model
  parameter_tier = var.parameter_tier
  region         = var.region

  tags = var.tags
}
#Testing Github Actions

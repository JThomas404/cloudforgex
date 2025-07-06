module "s3_bucket" {
  source = "./modules/s3"

  region                      = var.region
  tags                        = var.tags
  cloudfront_distribution_arn = module.cloudfront.distribution_arn
}

module "acm_certificate" {
  source = "./modules/acm"

  domain_name             = var.domain_name
  sub_alt_names           = var.sub_alt_names
  validation_record_fqdns = module.route53.validation_record_fqdns
  tags                    = var.tags
}

module "route53" {
  source = "./modules/route53"

  domain_name               = var.domain_name
  domain_validation_options = module.acm_certificate.domain_validation_options
  cloudfront_domain_name    = module.cloudfront.distribution_domain_name
  tags                      = var.tags
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

  project_name = var.project_name
  region       = var.region

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

  project_name         = var.project_name
  region               = var.region
  lambda_function_arn  = module.lambda.lambda_function_arn
  lambda_function_name = module.lambda.lambda_function_name
  api_name             = var.api_name
  stage_name           = var.stage_name
  allowed_origin       = var.allowed_origin

  tags = var.tags
}

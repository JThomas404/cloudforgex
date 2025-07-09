output "dashboard_url" {
  description = "CloudWatch Dashboard URL"
  value       = "https://${var.region}.console.aws.amazon.com/cloudwatch/home?region=${var.region}#dashboards:name=${aws_cloudwatch_dashboard.cfx_cw_dashboard.dashboard_name}"
}

output "dashboard_name" {
  description = "Dashboard name"
  value       = aws_cloudwatch_dashboard.cfx_cw_dashboard.dashboard_name
}

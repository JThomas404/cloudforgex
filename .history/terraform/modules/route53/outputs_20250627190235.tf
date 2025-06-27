
output "route53_zone_id" {
  description = "Route 53 Hosted Zone ID"
  value       = data.aws_route53_zone.cfx_r53_zone.zone_id
}

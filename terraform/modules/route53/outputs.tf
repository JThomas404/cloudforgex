output "route53_zone_id" {
  description = "Route 53 Hosted Zone ID"
  value       = data.aws_route53_zone.cfx_r53_zone.zone_id
}

output "validation_record_fqdns" {
  description = "FQDNs of validation records for ACM certificate validation"
  value       = [for record in aws_route53_record.cert_validation : record.fqdn]
}

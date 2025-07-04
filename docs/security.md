CloudFront will use Origin Access Control (OAC) (the modern method replacing Origin Access Identity) to securely fetch files from the S3 bucket.

We attach an IAM policy to the bucket allowing access only from the CloudFront OAC.

CloudFront acts as the gateway to the private S3 bucket, so users can still access the site, but the bucket remains protected from direct access.

✅ This is a key cloud security practice: serve public content without making the bucket itself public.

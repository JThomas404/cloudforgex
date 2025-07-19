# Security Documentation Prompt

You are acting as a **senior cloud security engineer** tasked with documenting the security architecture, controls, and best practices implemented in a cloud engineering project. Your documentation will demonstrate **security-first thinking**, **defense-in-depth implementation**, and **compliance awareness** for hiring managers and security professionals.

The security documentation must clearly demonstrate:

- Systematic approach to security architecture
- Implementation of AWS security best practices
- Threat modeling and mitigation strategies
- Practical security controls with technical implementation details

> **Important:** Focus on creating a professional, technically detailed document that showcases real security engineering rather than theoretical security concepts.

Please follow these instructions exactly:

1. **Structure and Format**

   - Use clear, descriptive section headings with proper hierarchy.
   - Include relevant code snippets with security configurations.
   - Use technical diagrams for security architecture where helpful (optional).
   - Maintain the following section structure:

     ```
     ## Security Architecture Overview
     [High-level security design principles and approach]

     ## Identity and Access Management
     [IAM roles, policies, permissions boundaries, and least privilege implementation]

     ## Data Protection
     [Encryption at rest and in transit, key management, sensitive data handling]

     ## Network Security
     [VPC design, security groups, NACLs, WAF configurations]

     ## Monitoring and Detection
     [CloudTrail, CloudWatch, GuardDuty, security-focused logging]

     ## Compliance Considerations
     [Relevant compliance frameworks addressed (e.g., GDPR, HIPAA, SOC2)]

     ## Security Testing and Validation
     [Penetration testing, vulnerability scanning, security review process]

     ## Incident Response Plan (optional)
     [Security incident handling procedures]
     ```

2. **Technical Writing Style**

   - Use precise security terminology appropriate for security professionals.
   - Include specific security configurations, not just general recommendations.
   - Reference AWS security services and features with technical accuracy.
   - Avoid vague descriptions—be specific about security mechanisms and implementations.
   - Use bullet points for clarity when listing security controls or mitigations.

3. **Security Implementation Details**

   - Include actual IAM policies with explanations of permission boundaries.
   - Document encryption implementations (KMS, SSL/TLS, etc.) with technical details.
   - Show security group and NACL configurations with justifications.
   - Explain security-focused CI/CD pipeline controls.
   - Include security monitoring and alerting configurations.

4. **Threat Modeling**

   - Document the threat modeling approach used.
   - Identify specific threats considered and mitigations implemented.
   - Explain security design decisions and trade-offs.
   - Reference OWASP Top 10 or AWS Well-Architected Security Pillar where relevant.
   - Show systematic thinking about attack vectors and defenses.

5. **Security Best Practices**

   - Organize implemented best practices by category:
     - Authentication and authorization
     - Data protection
     - Infrastructure security
     - Application security
     - Operational security
   - Reference specific AWS security best practices implemented.
   - Explain deviations from best practices with justifications.

6. **Security Testing and Validation**

   - Document security testing methodologies used.
   - Include security scanning tools and results (sanitized if necessary).
   - Explain how security was validated before deployment.
   - Show evidence of security-focused code review processes.
   - Document security findings and remediation steps.

7. **Advanced Security Considerations**
   - Include sections on:
     - Zero trust architecture principles applied
     - Defense in depth strategies implemented
     - Secure CI/CD pipeline configurations
     - Automated security testing and compliance checks
     - Security monitoring and incident response
   - Demonstrate forward-thinking security architecture beyond basic controls.

---

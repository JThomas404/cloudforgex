# CloudForgeX - Cloud Engineering Portfolio

A comprehensive cloud engineering portfolio showcasing AWS infrastructure, Terraform automation, and modern web development with an AI-powered assistant.

## 🚀 Project Overview

CloudForgeX demonstrates real-world cloud engineering expertise through:

- **Modern Web Portfolio** - Responsive frontend with professional design
- **EVE AI Assistant** - Intelligent chatbot powered by AWS Bedrock and Claude
- **Infrastructure as Code** - Complete AWS infrastructure using Terraform
- **Containerization** - Docker and Kubernetes deployment configurations
- **CI/CD Pipelines** - Automated deployment with GitHub Actions

## 🏗️ Architecture

### Frontend Architecture
- **Framework**: Vanilla JavaScript with ES6+ classes
- **Styling**: Modern CSS with CSS Grid and Flexbox
- **AI Assistant**: EVE - Intelligent chatbot with certificate integration
- **Responsive Design**: Mobile-first approach with accessibility features

### Cloud Infrastructure
- **AWS Services**: S3, CloudFront, Route53, ACM, Lambda, DynamoDB
- **Infrastructure as Code**: Terraform modules for reusable components
- **Security**: SSL/TLS certificates, CORS policies, secure S3 configurations
- **Performance**: CDN distribution with global edge locations

### EVE AI Assistant Features
- **Intelligent Responses**: Comprehensive knowledge base about Jarred's expertise
- **Certificate Integration**: Secure S3-based certificate viewing
- **Modern UI/UX**: Professional animations and micro-interactions
- **Mobile Optimized**: Full-screen mobile experience
- **Accessibility**: WCAG compliant with keyboard navigation

## 🛠️ Technology Stack

### Frontend
- **Languages**: HTML5, CSS3, JavaScript (ES6+)
- **Frameworks**: Vanilla JS with modern patterns
- **Libraries**: AOS (Animate On Scroll), FontAwesome
- **Build Tools**: Native browser support, no build process required

### Infrastructure
- **Cloud Provider**: AWS
- **IaC Tool**: Terraform
- **Containerization**: Docker, Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: CloudWatch (planned)

### AI Integration
- **AI Service**: AWS Bedrock with Claude Instant
- **Backend**: AWS Lambda (Python)
- **Database**: DynamoDB for context storage
- **API**: API Gateway for secure communication

## 📁 Project Structure

```
cloudforgex/
├── frontend/                 # Main web application
│   ├── assets/              # Static assets (images, documents, fonts)
│   ├── css/                 # Stylesheets
│   ├── js/                  # JavaScript files
│   ├── index.html           # Main portfolio page
│   └── resume.html          # Resume page
├── terraform/               # Infrastructure as Code
│   ├── modules/             # Reusable Terraform modules
│   ├── main.tf              # Main infrastructure configuration
│   └── variables.tf         # Variable definitions
├── lambda/                  # AWS Lambda functions
├── k8s/                     # Kubernetes configurations
├── docs/                    # Project documentation
└── .github/workflows/       # CI/CD pipelines
```

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- AWS CLI (for infrastructure deployment)
- Terraform >= 1.0
- Docker (for containerization)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/JThomas404/cloudforgex.git
   cd cloudforgex
   ```

2. **Serve the frontend locally**
   ```bash
   cd frontend
   python -m http.server 8000
   # or
   npx serve .
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Infrastructure Deployment

1. **Configure AWS credentials**
   ```bash
   aws configure
   ```

2. **Deploy infrastructure**
   ```bash
   cd terraform
   terraform init
   terraform plan
   terraform apply
   ```

3. **Upload frontend to S3**
   ```bash
   aws s3 sync ../frontend/ s3://your-bucket-name --delete
   ```

## 🤖 EVE AI Assistant

EVE (Enhanced Virtual Engineer) is an intelligent AI assistant that provides information about Jarred's expertise, projects, and certifications.

### Features
- **Intelligent Conversations**: Natural language processing for technical queries
- **Certificate Viewing**: Secure access to professional certifications
- **Project Information**: Detailed insights into cloud engineering projects
- **Professional Guidance**: Career advice and technical recommendations

### Technical Implementation
- **Frontend**: Modern JavaScript with ES6 classes
- **Backend**: AWS Lambda with Python
- **AI Engine**: AWS Bedrock with Claude Instant
- **Security**: Presigned URLs for secure document access
- **Performance**: Optimized animations and caching

## 📊 Key Features

### Portfolio Highlights
- **Professional Design**: Modern, responsive layout
- **Interactive Elements**: Smooth animations and transitions
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: Optimized loading and rendering

### Technical Demonstrations
- **Infrastructure as Code**: Complete AWS setup with Terraform
- **Security Best Practices**: SSL/TLS, CORS, secure configurations
- **Scalability**: Auto-scaling and load balancing configurations
- **Monitoring**: CloudWatch integration for observability

## 🔧 Development

### Code Quality
- **Modern JavaScript**: ES6+ features with proper error handling
- **CSS Architecture**: Organized stylesheets with CSS custom properties
- **Security**: CSP compliance and XSS protection
- **Performance**: Optimized assets and lazy loading

### Best Practices
- **Version Control**: Git with conventional commits
- **Documentation**: Comprehensive inline and external documentation
- **Testing**: Manual testing across devices and browsers
- **Deployment**: Automated CI/CD with GitHub Actions

## 📈 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Load Time**: < 2 seconds on 3G networks
- **Accessibility**: WCAG 2.1 AA compliant
- **SEO**: Optimized meta tags and structured data

## 🔒 Security

- **SSL/TLS**: End-to-end encryption
- **CORS**: Proper cross-origin resource sharing
- **CSP**: Content Security Policy implementation
- **Secure Headers**: HSTS, X-Frame-Options, etc.

## 📞 Contact

**Jarred Thomas** - Cloud Engineer
- **Email**: jarredthomas101@gmail.com
- **LinkedIn**: [linkedin.com/in/jarred-thomas](https://www.linkedin.com/in/jarred-thomas)
- **GitHub**: [github.com/JThomas404](https://github.com/JThomas404)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- AWS for cloud infrastructure services
- Anthropic for Claude AI integration
- Open source community for tools and libraries
- Professional network for guidance and feedback

---

**Built with ❤️ by Jarred Thomas - Transforming ideas into scalable cloud solutions**
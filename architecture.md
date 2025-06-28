# Architecture Overview

## System Architecture Diagram

```mermaid
graph TB
    subgraph "Development"
        A["Developer"] --> B["Code Push"]
        B --> C["GitHub Repository"]
    end

    subgraph "CI/CD Pipeline"
        C --> D["GitHub Actions"]
        D --> E["Lint & Test"]
        E --> F["Docker Build"]
        F --> G["Security Scan<br/>Trivy"]
        G --> H["Push to<br/>Artifact Registry"]
        H --> I["Deploy to<br/>Cloud Run"]
    end

    subgraph "Google Cloud Platform"
        J["Artifact Registry<br/>us-central1"]
        K["Cloud Run<br/>my-node-app"]
        L["Cloud Logging"]
        M["IAM & Security"]
    end

    subgraph "Users"
        N["Public Internet"] --> O["HTTPS Endpoint"]
        O --> P["API Response<br/>status: ok"]
    end

    H --> J
    I --> K
    K --> L
    M --> K
    K --> O

    style A fill:#e1f5fe
    style K fill:#c8e6c9
    style J fill:#fff3e0
    style D fill:#f3e5f5
```

## Component Description

### Development Layer

- **Developer**: Writes code and pushes changes
- **GitHub Repository**: Version control and source of truth

### CI/CD Pipeline

- **GitHub Actions**: Automated workflow orchestration
- **Lint & Test**: Code quality and correctness validation
- **Docker Build**: Container image creation
- **Security Scan**: Vulnerability assessment with Trivy
- **Artifact Registry**: Secure container image storage
- **Cloud Run Deployment**: Serverless application hosting

### Google Cloud Platform

- **Artifact Registry**: Private Docker registry in us-central1
- **Cloud Run**: Managed serverless compute platform
- **Cloud Logging**: Centralized log aggregation
- **IAM & Security**: Identity and access management

### User Access

- **Public Internet**: External user access
- **HTTPS Endpoint**: Secure API endpoint
- **API Response**: JSON response with application status

## Data Flow

1. Developer pushes code to GitHub repository
2. GitHub Actions triggers automated CI/CD pipeline
3. Pipeline runs tests, builds Docker image, and scans for vulnerabilities
4. Secure image is pushed to Google Artifact Registry
5. Cloud Run service is updated with new image
6. Users access the API via HTTPS endpoint
7. Application logs are automatically sent to Cloud Logging
8. IAM controls access to all GCP resources

## Security Considerations

- **Non-root containers**: Application runs with limited privileges
- **Private registry**: Images stored in secure Artifact Registry
- **Secret management**: Credentials managed via GitHub Secrets
- **HTTPS by default**: All traffic encrypted in transit
- **Vulnerability scanning**: Automated security assessment

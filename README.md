# Node.js API - DevOps Challenge

A simple "Hello World" JSON API built with Node.js and Express, featuring a complete CI/CD pipeline for Google Cloud Platform deployment.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker
- Google Cloud SDK
- GitHub account

### Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd Challenge

# Install dependencies
cd app && npm install

# Start the server
npm start

# Test the API
curl http://localhost:3000
# Expected output: {"status":"ok"}
```

## 🏗️ Architecture

### Application Stack

- **Runtime**: Node.js 18
- **Framework**: Express.js 5.1.0
- **Container**: Docker (Alpine Linux)
- **Deployment**: Google Cloud Run
- **Registry**: Google Artifact Registry
- **CI/CD**: GitHub Actions

### Infrastructure Components

```
GitHub → GitHub Actions → Artifact Registry → Cloud Run
   ↓           ↓              ↓               ↓
 Source    Build/Test     Store Images    Serve API
```

## 🔧 Setup Instructions

### 1. Google Cloud Setup

```bash
# Create a new project (or use existing)
gcloud projects create your-project-id
gcloud config set project your-project-id

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Create Artifact Registry repository
gcloud artifacts repositories create my-repo \
    --repository-format=docker \
    --location=us-central1
```

### 2. Service Account & IAM Setup

```bash
# Create service account
gcloud iam service-accounts create github-actions-sa \
    --display-name="GitHub Actions Service Account"

# Assign minimal required roles
gcloud projects add-iam-policy-binding your-project-id \
    --member="serviceAccount:github-actions-sa@your-project-id.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding your-project-id \
    --member="serviceAccount:github-actions-sa@your-project-id.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding your-project-id \
    --member="serviceAccount:github-actions-sa@your-project-id.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"

# Generate service account key
gcloud iam service-accounts keys create key.json \
    --iam-account=github-actions-sa@your-project-id.iam.gserviceaccount.com
```

### 3. GitHub Secrets Configuration

Add these secrets to your GitHub repository:

- `GCP_PROJECT_ID`: Your Google Cloud project ID
- `GCP_SA_KEY`: Contents of the service account key.json file

### 4. Update Configuration

Edit `.github/workflows/ci.yaml`:

- Update `PROJECT_ID`, `SERVICE`, `REGION`, `REPOSITORY` variables
- Ensure image URI matches your project settings

## 🔒 Security Implementation

### Docker Security

- **Non-root user**: Application runs as `nextjs:nodejs` (UID 1001)
- **Minimal base image**: Alpine Linux for reduced attack surface
- **Vulnerability scanning**: Trivy integration in CI pipeline
- **Multi-stage build**: Optimized for production

### IAM & Access Control

- **Principle of least privilege**: Service account has minimal required permissions
- **Secret management**: All credentials stored in GitHub Secrets
- **No hardcoded credentials**: Environment-based configuration

### Cloud Run Security

- **Private container registry**: Uses Artifact Registry
- **Managed platform**: Automatic security updates
- **HTTPS by default**: SSL/TLS termination included

## 💰 Cost Analysis

### Free Tier Usage (Monthly)

- **Cloud Run**: 2M requests, 360,000 GB-seconds, 180,000 vCPU-seconds
- **Artifact Registry**: 0.5 GB storage
- **Cloud Build**: 120 build-minutes/day

### Estimated Monthly Costs

- **Development usage**: $0 (within free tier)
- **Light production**: $1-5/month
- **Moderate traffic**: $10-25/month

_Note: Costs depend on request volume, CPU/memory usage, and storage needs._

## 🚀 CI/CD Pipeline

### Pipeline Stages

1. **Auto Version Increment**: Automatically bumps version and creates tags
2. **Lint & Test**: Code quality checks and unit tests
3. **Build & Scan**: Docker build, vulnerability scan, push to registry
4. **Deploy**: Cloud Run deployment with health checks

### Deployment Process

#### Automatic Version Management

The pipeline automatically increments versions on every push:

```bash
# Default: Patch version bump (1.0.1 → 1.0.2)
git commit -m "Fix bug in API response"
git push origin main
# Result: Creates v1.0.2 tag, v1.0.1 persists

# Minor version bump (1.0.2 → 1.1.0)
git commit -m "Add new endpoint [minor]"
git push origin main
# Result: Creates v1.1.0 tag, previous versions persist

# Major version bump (1.1.0 → 2.0.0)
git commit -m "Breaking API changes [major]"
git push origin main
# Result: Creates v2.0.0 tag, all previous versions persist

# Skip version bump (no change)
git commit -m "Update documentation [skip-version]"
git push origin main
# Result: No version change, uses current version
```

#### Version Progression Example

Each push creates a new version while preserving old ones:

- Push 1: `v1.0.1`, `latest`
- Push 2: `v1.0.1`, `v1.0.2`, `latest`
- Push 3: `v1.0.1`, `v1.0.2`, `v1.0.3`, `latest`

#### Manual Deployment (if needed)

```bash
gcloud run deploy my-node-app \
    --image=us-central1-docker.pkg.dev/your-project/my-repo/my-node-app:latest \
    --region=us-central1 \
    --platform=managed \
    --allow-unauthenticated
```

### Rollback Instructions

```bash
# List revisions
gcloud run revisions list --service=my-node-app --region=us-central1

# Rollback to previous revision
gcloud run services update-traffic my-node-app \
    --to-revisions=REVISION_NAME=100 \
    --region=us-central1
```

## 🔍 Monitoring & Observability

### Health Checks

- **Endpoint**: `GET /` returns `{"status":"ok"}`
- **Automated**: CI pipeline includes health check validation
- **Uptime monitoring**: Built into Cloud Run

### Logging

- **Cloud Logging**: Automatic log aggregation
- **Request logging**: Morgan middleware for HTTP request logs
- **Error tracking**: Express error handling

### Accessing Logs

```bash
# View application logs
gcloud logs read "resource.type=cloud_run_revision" --limit=50

# Real-time log streaming
gcloud logs tail "resource.type=cloud_run_revision"
```

## 🛠️ Technical Decisions

### Why Node.js + Express?

- **Simplicity**: Minimal setup for API endpoints
- **Performance**: Fast startup times ideal for Cloud Run
- **Ecosystem**: Rich middleware ecosystem

### Why Google Cloud Run?

- **Serverless**: Pay-per-request pricing model
- **Scalability**: Automatic scaling from 0 to N instances
- **Free tier**: Generous limits for development

### Why GitHub Actions over Cloud Build?

- **Integration**: Native GitHub integration
- **Flexibility**: Rich ecosystem of actions
- **Visibility**: Clear pipeline status in PRs
- **Cost**: Free for public repositories

### Why Artifact Registry?

- **Security**: Private container registry
- **Integration**: Native GCP service integration
- **Vulnerability scanning**: Built-in security scanning

## 📋 API Documentation

### Endpoints

#### GET /

Returns application status.

**Response:**

```json
{
  "status": "ok"
}
```

**Example:**

```bash
curl https://your-service-url.run.app/
```

## 🚧 Future Enhancements

- [ ] Add comprehensive unit tests
- [ ] Implement proper linting configuration
- [ ] Add environment-specific configurations
- [ ] Implement request rate limiting
- [ ] Add metrics collection
- [ ] Database integration
- [ ] Authentication middleware

---

**Live URL**: [Will be available after deployment]  
**Demo Video**: [To be recorded after deployment]

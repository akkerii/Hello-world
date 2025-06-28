# Node.js API - DevOps Challenge

A simple Express API that returns `{"status": "ok"}`. This project demonstrates a complete CI/CD pipeline on Google Cloud Platform with automated deployments, security scanning, and version management.

## What it does

- Basic Node.js API with one endpoint
- Automatic CI/CD pipeline on every push
- Docker containerization with security best practices
- Deployment to Google Cloud Run
- Automatic version tagging and artifact management

## Quick Setup

### Prerequisites

- Google Cloud account (free tier works)
- GitHub account
- Basic knowledge of Docker and gcloud CLI

### 1. Google Cloud Setup

```bash
# Create project and set it as default
gcloud projects create your-project-id
gcloud config set project your-project-id

# Enable required services
gcloud services enable run.googleapis.com artifactregistry.googleapis.com

# Create Docker repository
gcloud artifacts repositories create my-repo \
    --repository-format=docker \
    --location=us-central1
```

### 2. IAM Roles & Service Account

I chose to use a dedicated service account with minimal permissions following the principle of least privilege:

```bash
# Create service account for GitHub Actions
gcloud iam service-accounts create github-actions-sa

# Assign only necessary roles
gcloud projects add-iam-policy-binding your-project-id \
    --member="serviceAccount:github-actions-sa@your-project-id.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding your-project-id \
    --member="serviceAccount:github-actions-sa@your-project-id.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding your-project-id \
    --member="serviceAccount:github-actions-sa@your-project-id.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"

# Generate key for GitHub Actions
gcloud iam service-accounts keys create key.json \
    --iam-account=github-actions-sa@your-project-id.iam.gserviceaccount.com
```

**IAM Roles Explained:**

- `run.admin`: Deploy and manage Cloud Run services
- `artifactregistry.writer`: Push Docker images to registry
- `iam.serviceAccountUser`: Required for Cloud Run deployments

### 3. GitHub Configuration

Add these secrets to your GitHub repository:

- `GCP_PROJECT_ID`: Your Google Cloud project ID
- `GCP_SA_KEY`: Contents of the key.json file (entire JSON)

Update the workflow file with your project details in the `env` section.

## Cost Estimates

### Free Tier Limits (Monthly)

- **Cloud Run**: 2 million requests, 360,000 GB-seconds
- **Artifact Registry**: 0.5 GB storage
- **Cloud Build**: 120 build-minutes per day

### Expected Costs

- **Development/Testing**: $0 (stays within free tier)
- **Light Production**: $1-3/month
- **Medium Traffic**: $5-15/month

The serverless nature of Cloud Run means you only pay for actual usage. For this simple API, costs will be minimal unless you get significant traffic.

## Technical Decisions

### Why gcloud CLI over Terraform?

I chose gcloud CLI because:

- Simpler for this scope - just a few resources
- Faster iteration during development
- Direct GCP integration without state management
- Better for learning GCP services hands-on
- Less overhead for a demo project

For production or larger projects, I'd definitely use Terraform for infrastructure as code.

### Architecture Choices

**Node.js + Express**: Minimal overhead, fast cold starts perfect for Cloud Run
**Alpine Linux**: Smaller attack surface, faster builds
**Cloud Run**: Pay-per-request, automatic HTTPS, scales to zero
**GitHub Actions**: Free for public repos, good Docker integration
**Artifact Registry**: Better than Docker Hub for GCP integration

### Security Approach

- Non-root container user
- Minimal base image (Alpine)
- Vulnerability scanning with Trivy
- Least-privilege IAM roles
- No hardcoded secrets
- Private container registry

## How the Pipeline Works

1. **Push to main** → Triggers GitHub Actions
2. **Version calculation** → Auto-increments using run numbers
3. **Lint & Test** → Code quality checks (basic for now)
4. **Docker Build** → Multi-stage build, security scan
5. **Push to Registry** → Tagged with version + latest
6. **Deploy** → Updates Cloud Run service
7. **Health Check** → Verifies deployment success

### Versioning Strategy

Each push creates a unique version:

- Default: patch increment (1.0.1 → 1.0.2, 1.0.3...)
- Add `[minor]` to commit: minor bump (1.0.1 → 1.1.0)
- Add `[major]` to commit: major bump (1.0.1 → 2.0.0)
- Add `[skip-version]`: no version change

All previous versions remain available for rollbacks.

## API Documentation

### GET /

Returns application status.

**Response:**

```json
{
  "status": "ok"
}
```

## Manual Operations

### Deploy manually

```bash
gcloud run deploy my-node-app \
    --image=us-central1-docker.pkg.dev/your-project/my-repo/my-node-app:latest \
    --region=us-central1 \
    --allow-unauthenticated
```

### Rollback

```bash
# List revisions
gcloud run revisions list --service=my-node-app

# Route traffic to previous revision
gcloud run services update-traffic my-node-app \
    --to-revisions=REVISION_NAME=100
```

### View logs

```bash
gcloud logs tail "resource.type=cloud_run_revision"
```

## What I'd improve

- Add comprehensive unit tests
- Implement proper linting (ESLint)
- Add environment-specific configurations
- Set up monitoring and alerting
- Add database if needed
- Implement authentication for production use

---

**Live URL**: [Available after deployment]  
**Demo Video**: [Will record after first successful deployment]

This setup demonstrates modern DevOps practices with automated testing, security scanning, and zero-downtime deployments while staying within GCP's free tier limits.

# Node.js API - DevOps Challenge 🚀

This simple Node.js API, built with Express, is part of a DevOps challenge demonstrating a complete CI/CD pipeline setup on Google Cloud Platform using GitHub Actions.

## Quick Start

### Requirements

- Node.js 18+
- Docker
- Google Cloud SDK
- GitHub Account

### Run Locally

```bash
git clone <your-repo-url>
cd Challenge/app
npm install
npm start
```

Test it out:

```bash
curl http://localhost:3000
# You should see: {"status":"ok"}
```

## Tech Stack ⚙️

- Node.js & Express
- Docker (Alpine Linux)
- Google Cloud Run
- Artifact Registry
- GitHub Actions (CI/CD)

## CI/CD Pipeline Overview

Flow:  
```
GitHub → GitHub Actions → Artifact Registry → Cloud Run
```

## Google Cloud Setup

Create and configure the project:

```bash
gcloud projects create your-project-id
gcloud config set project your-project-id

gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com

gcloud artifacts repositories create my-repo \
  --repository-format=docker \
  --location=us-central1
```

### Service Account

```bash
gcloud iam service-accounts create github-actions-sa --display-name="GitHub Actions SA"

gcloud projects add-iam-policy-binding your-project-id \
  --member="serviceAccount:github-actions-sa@your-project-id.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding your-project-id \
  --member="serviceAccount:github-actions-sa@your-project-id.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding your-project-id \
  --member="serviceAccount:github-actions-sa@your-project-id.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions-sa@your-project-id.iam.gserviceaccount.com
```

### GitHub Secrets

In GitHub repo settings, add these secrets:

- `GCP_PROJECT_ID`: Your Google Cloud project ID
- `GCP_SA_KEY`: Contents of key.json

### Configure CI Workflow

Edit `.github/workflows/ci.yaml`, set your:

- PROJECT_ID
- SERVICE
- REGION

## Security 🔐

- Non-root Docker image (Alpine)
- Vulnerability scans with Trivy
- Minimal GCP permissions
- HTTPS on Cloud Run
- GitHub secrets management

## Estimated Costs 💰

- Free tier covers most dev use cases
- Light production: ~$5/month
- Higher usage varies by traffic volume

## Automated CI/CD 🤖

On each push:

- Auto-versioning (patch/minor/major)
- Linting & testing
- Docker build & security scan
- Deployment to Cloud Run

Version examples:

```bash
git commit -m "fix issue"
# → v1.0.1

git commit -m "add feature [minor]"
# → v1.1.0

git commit -m "breaking change [major]"
# → v2.0.0

git commit -m "docs update [skip-version]"
# → No version increment
```

Rollback easily:

```bash
gcloud run revisions list --service=my-node-app --region=us-central1

gcloud run services update-traffic my-node-app \
  --to-revisions=REVISION_NAME=100 \
  --region=us-central1
```

Manual deployment:

```bash
gcloud run deploy my-node-app \
  --image=us-central1-docker.pkg.dev/your-project/my-repo/my-node-app:latest \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated
```

## Monitoring 📈

Health endpoint:

```json
{"status":"ok"}
```

Logs:

```bash
gcloud logs read "resource.type=cloud_run_revision" --limit=50
gcloud logs tail "resource.type=cloud_run_revision"
```





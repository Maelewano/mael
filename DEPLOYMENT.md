# Git Flow Deployment Setup

Single repository with 3-branch workflow for clean development and deployment.

## Branch Structure

### 🔧 `develop` (Development)
- **Purpose**: Active development and feature integration
- **Usage**: Daily commits, feature branches merge here
- **Stability**: May be unstable, experimental features

### 🧪 `staging` (Pre-production)
- **Purpose**: Testing and quality assurance
- **Usage**: Deploy features from develop for testing
- **Stability**: Should be stable, feature-complete for testing

### 🚀 `master` (Production)
- **Purpose**: Live production environment
- **Usage**: Only stable, tested code from staging
- **Stability**: Always production-ready

## Workflow

```
develop → staging → master
   ↓        ↓        ↓
 features  testing production
```

## Setup Instructions

### 1. Create Branches
```bash
# Create and setup staging branch
git checkout -b staging
git push -u origin staging

# Create and setup develop branch  
git checkout -b develop
git push -u origin develop

# Set develop as default working branch
git checkout develop
```

### 2. Protect Master Branch
Set up GitHub branch protection rules:
- Go to **Settings** → **Branches** → **Add rule**
- Branch pattern: `master`
- Enable:
  - ✅ **Require pull request before merging**
  - ✅ **Require status checks to pass**
  - ✅ **Require branches to be up to date**
  - ✅ **Do not allow bypassing settings**

### 3. Configure Vercel
- **Production**: Connect `master` branch → maelewano.vercel.app
- **Preview**: Connect `staging` branch → maelewano-git-staging.vercel.app
- **Development**: Local development only

### 3. Deployment Commands
```bash
# Deploy to staging
git checkout develop
# ... make changes ...
git commit -m "feat: new feature"
./scripts/deploy.sh

# Deploy to production  
git checkout staging
./scripts/deploy.sh
```

## Development Workflow

### Daily Development
```bash
git checkout develop
git pull origin develop
# ... make changes ...
git add .
git commit -m "feat: description"
git push origin develop
```

### Deploy to Staging
```bash
# From develop branch
./scripts/deploy.sh
# Automatically merges develop → staging
```

### Deploy to Production
```bash
# From staging branch (after testing)
./scripts/deploy.sh
# Prompts confirmation, then merges staging → master
# OR
git cherry-pick -m 1 '<commit_no>'
```

## Environment Variables

Set in Vercel for each branch:

**Production (master branch)**:
- All production API keys
- Production database URLs
- `NODE_ENV=production`

**Staging (staging branch)**:
- Test API keys
- Staging database URLs  
- `NODE_ENV=staging`

### Automated Sync (via GitHub Actions)
- Automatically syncs when you push to `master` or `develop`
- Configured in `.github/workflows/sync-to-main.yml`
- Requires `PERSONAL_ACCESS_TOKEN` secret in GitHub

## Environment Variables

Make sure these are set in Vercel:
- `NEXT_PUBLIC_DROPBOX_SIGN_CLIENT_ID`
- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- Any other API keys from your `.env`

## Benefits

✅ Clean separation of development and deployed
✅ deployed repo only contains deployed code
✅ Better control over what gets deployed
✅ Easy rollback capabilities
✅ Automated deployment pipeline
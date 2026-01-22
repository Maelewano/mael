#!/bin/bash

# Git Flow deployment script
# Usage: ./scripts/deploy.sh

set -e

echo "🌟 Git Flow Deployment Script"

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📋 Current branch: $CURRENT_BRANCH"

# Configurable deployment URLs (can be overridden with env vars)
DEVELOP_URL=${DEVELOP_URL:-"https://mael-git-develop-mollusque.vercel.app/"}
STAGING_URL=${STAGING_URL:-"https://mael-git-staging-mollusque.vercel.app/"}
PRODUCTION_URL=${PRODUCTION_URL:-"https://maelewano.vercel.app"}

# Dry-run flag: when true, commands are echoed instead of executed
DRY_RUN=${DRY_RUN:-"false"}

# Helper to run commands (respects DRY_RUN)
run_cmd() {
    if [[ "$DRY_RUN" == "true" ]]; then
        echo "[DRY_RUN] $*"
    else
        eval "$*"
    fi
}

case $CURRENT_BRANCH in
    "develop")
        echo "🔄 Merging develop → staging..."
        run_cmd "git checkout staging"
        run_cmd "git pull origin staging"
        run_cmd "git merge develop --no-ff -m \"Merge develop into staging\""
        run_cmd "git push origin staging"
        echo "✅ Successfully deployed to staging!"
        echo "🌐 Develop URL: ${DEVELOP_URL}"
        echo "🌐 Staging URL: ${STAGING_URL}"
        ;;
    
    "staging")
        echo "🚀 Deploying staging → master (production)..."
        if [[ "$DRY_RUN" == "true" ]]; then
            echo "[DRY_RUN] Auto-confirming production deploy"
            confirm="y"
        else
            read -p "Are you sure you want to deploy to production? (y/N): " confirm
        fi
        if [[ $confirm == [yY] ]]; then
            run_cmd "git checkout master"
            run_cmd "git pull origin master"
            run_cmd "git merge staging --no-ff -m \"Release: $(date '+%Y-%m-%d %H:%M:%S')\""
            run_cmd "git push origin master"
            echo "🎉 Successfully deployed to production!"
            echo "🌐 Staging URL: ${STAGING_URL}"
            echo "🌐 Production URL: ${PRODUCTION_URL}"
        else
            echo "❌ Deployment cancelled"
        fi
        ;;
    
    "master")
        echo "⚠️  You're on master branch. Use staging branch to deploy to production."
        ;;
    
    *)
        echo "❌ Please switch to develop or staging branch"
        echo "📖 Workflow:"
        echo "   develop → staging → master"
        ;;
esac
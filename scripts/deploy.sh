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

case $CURRENT_BRANCH in
    "develop")
        echo "🔄 Merging develop → staging..."
        git checkout staging
        git pull origin staging
        git merge develop --no-ff -m "Merge develop into staging"
        git push origin staging
        echo "✅ Successfully deployed to staging!"
        echo "🌐 Develop URL: ${DEVELOP_URL}"
        echo "🌐 Staging URL: ${STAGING_URL}"
        ;;
    
    "staging")
        echo "🚀 Deploying staging → master (production)..."
        read -p "Are you sure you want to deploy to production? (y/N): " confirm
        if [[ $confirm == [yY] ]]; then
            git checkout master
            git pull origin master
            git merge staging --no-ff -m "Release: $(date '+%Y-%m-%d %H:%M:%S')"
            git push origin master
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
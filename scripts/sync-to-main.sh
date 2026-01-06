#!/bin/bash

# Wrapper script - calls the main deployment script
# Usage: ./scripts/sync-to-main.sh

# Call the main deploy script
exec "$(dirname "$0")/deploy.sh"
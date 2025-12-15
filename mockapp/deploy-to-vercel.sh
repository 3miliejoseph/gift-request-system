#!/bin/bash

# ========================================
# Vercel Deployment Script
# ========================================
# This script helps deploy the Gift Request System to Vercel
# with proper environment variable configuration

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Gift Request System - Vercel Deploy${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if .env file exists
if [ ! -f "../.env" ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo ""
    echo "Please create a .env file in the project root with:"
    echo "  1. Copy .env.example to .env"
    echo "  2. Fill in your DATABASE_URL from Neon"
    echo "  3. Set your ADMIN_USERNAME and ADMIN_PASSWORD"
    echo "  4. Generate a SESSION_SECRET"
    echo ""
    echo "Run this command to create .env:"
    echo -e "${YELLOW}  cp .env.example .env${NC}"
    echo ""
    exit 1
fi

# Load environment variables from .env
echo -e "${YELLOW}Loading environment variables from .env...${NC}"
export $(cat ../.env | grep -v '^#' | xargs)

# Verify required environment variables
MISSING_VARS=()

if [ -z "$DATABASE_URL" ]; then
    MISSING_VARS+=("DATABASE_URL")
fi

if [ -z "$ADMIN_USERNAME" ]; then
    MISSING_VARS+=("ADMIN_USERNAME")
fi

if [ -z "$ADMIN_PASSWORD" ]; then
    MISSING_VARS+=("ADMIN_PASSWORD")
fi

if [ -z "$SESSION_SECRET" ]; then
    MISSING_VARS+=("SESSION_SECRET")
fi

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo -e "${RED}Error: Missing required environment variables:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo -e "  ${RED}- $var${NC}"
    done
    echo ""
    echo "Please update your .env file with all required variables."
    exit 1
fi

echo -e "${GREEN}✓ All required environment variables found${NC}"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
    echo -e "${GREEN}✓ Vercel CLI installed${NC}"
    echo ""
fi

# Navigate to project root
cd ..

# Login to Vercel (if not already logged in)
echo -e "${YELLOW}Checking Vercel authentication...${NC}"
vercel whoami &> /dev/null || {
    echo -e "${YELLOW}Please login to Vercel:${NC}"
    vercel login
}
echo -e "${GREEN}✓ Logged in to Vercel${NC}"
echo ""

# Link to Vercel project (or create new one)
echo -e "${YELLOW}Linking to Vercel project...${NC}"
if [ ! -d ".vercel" ]; then
    vercel link
else
    echo -e "${GREEN}✓ Already linked to Vercel project${NC}"
fi
echo ""

# Set environment variables in Vercel
echo -e "${YELLOW}Setting environment variables in Vercel...${NC}"
echo ""

echo "Setting DATABASE_URL..."
vercel env add DATABASE_URL production <<< "$DATABASE_URL" || echo "Already set or error"

echo "Setting ADMIN_USERNAME..."
vercel env add ADMIN_USERNAME production <<< "$ADMIN_USERNAME" || echo "Already set or error"

echo "Setting ADMIN_PASSWORD..."
vercel env add ADMIN_PASSWORD production <<< "$ADMIN_PASSWORD" || echo "Already set or error"

echo "Setting SESSION_SECRET..."
vercel env add SESSION_SECRET production <<< "$SESSION_SECRET" || echo "Already set or error"

echo ""
echo -e "${GREEN}✓ Environment variables configured${NC}"
echo ""

# Deploy to Vercel
echo -e "${YELLOW}Deploying to Vercel...${NC}"
echo ""
vercel --prod

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Initialize the database:"
echo -e "   ${GREEN}DATABASE_URL=\"\$DATABASE_URL\" npx prisma db push${NC}"
echo ""
echo "2. Visit your live site and test the admin login"
echo ""
echo "3. Update mockapp URLs to point to your production site"
echo ""


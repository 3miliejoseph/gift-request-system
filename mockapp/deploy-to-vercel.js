#!/usr/bin/env node

/**
 * Vercel Deployment Script (Node.js version)
 * ==========================================
 * Deploy Gift Request System to Vercel with environment variables
 * 
 * Usage:
 *   node deploy-to-vercel.js
 * 
 * Or make executable:
 *   chmod +x deploy-to-vercel.js
 *   ./deploy-to-vercel.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for terminal output
const colors = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, description) {
    try {
        log(`\n${description}...`, 'yellow');
        execSync(command, { stdio: 'inherit' });
        log(`✓ ${description} complete`, 'green');
        return true;
    } catch (error) {
        log(`✗ ${description} failed`, 'red');
        return false;
    }
}

// Main deployment function
async function deploy() {
    log('\n========================================', 'green');
    log('  Gift Request System - Vercel Deploy', 'green');
    log('========================================\n', 'green');

    // Navigate to project root
    const projectRoot = path.join(__dirname, '..');
    process.chdir(projectRoot);

    // Check for .env file
    const envPath = path.join(projectRoot, '.env');
    if (!fs.existsSync(envPath)) {
        log('Error: .env file not found!', 'red');
        log('\nPlease create a .env file in the project root:', 'yellow');
        log('  1. Copy .env.example to .env');
        log('  2. Fill in your DATABASE_URL from Neon');
        log('  3. Set your ADMIN_USERNAME and ADMIN_PASSWORD');
        log('  4. Generate a SESSION_SECRET');
        log('\nRun this command to create .env:', 'yellow');
        log('  cp .env.example .env\n', 'green');
        process.exit(1);
    }

    // Load environment variables
    log('Loading environment variables from .env...', 'yellow');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^#][^=]+)=(.+)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^["']|["']$/g, '');
            envVars[key] = value;
        }
    });

    // Verify required variables
    const requiredVars = ['DATABASE_URL', 'ADMIN_USERNAME', 'ADMIN_PASSWORD', 'SESSION_SECRET'];
    const missingVars = requiredVars.filter(varName => !envVars[varName] || envVars[varName].includes('your-') || envVars[varName].includes('changeme'));

    if (missingVars.length > 0) {
        log('\nError: Missing or incomplete environment variables:', 'red');
        missingVars.forEach(varName => log(`  - ${varName}`, 'red'));
        log('\nPlease update your .env file with all required variables.\n', 'yellow');
        process.exit(1);
    }

    log('✓ All required environment variables found\n', 'green');

    // Check if Vercel CLI is installed
    try {
        execSync('vercel --version', { stdio: 'ignore' });
        log('✓ Vercel CLI found', 'green');
    } catch (error) {
        log('Installing Vercel CLI...', 'yellow');
        execCommand('npm install -g vercel', 'Installing Vercel CLI');
    }

    // Login to Vercel
    try {
        execSync('vercel whoami', { stdio: 'ignore' });
        log('✓ Logged in to Vercel\n', 'green');
    } catch (error) {
        log('\nPlease login to Vercel:', 'yellow');
        execCommand('vercel login', 'Vercel login');
    }

    // Link to Vercel project
    if (!fs.existsSync(path.join(projectRoot, '.vercel'))) {
        execCommand('vercel link', 'Linking to Vercel project');
    } else {
        log('✓ Already linked to Vercel project\n', 'green');
    }

    // Set environment variables (this might prompt for overwrites)
    log('\nConfiguring environment variables in Vercel...', 'yellow');
    log('(You may be prompted to overwrite existing variables)\n', 'yellow');
    
    for (const [key, value] of Object.entries(envVars)) {
        if (requiredVars.includes(key)) {
            try {
                // Try to add, ignore errors if already exists
                execSync(`echo "${value}" | vercel env add ${key} production`, { 
                    stdio: 'pipe'
                });
                log(`✓ Set ${key}`, 'green');
            } catch (error) {
                // Variable might already exist, that's okay
                log(`  ${key} (already set or skipped)`, 'yellow');
            }
        }
    }

    log('\n✓ Environment variables configured\n', 'green');

    // Deploy to production
    const deploySuccess = execCommand('vercel --prod', 'Deploying to Vercel');

    if (deploySuccess) {
        log('\n========================================', 'green');
        log('  Deployment Complete! 🎉', 'green');
        log('========================================\n', 'green');
        
        log('Next steps:', 'yellow');
        log('1. Initialize the database:', 'yellow');
        log(`   DATABASE_URL="${envVars.DATABASE_URL}" npx prisma db push\n`, 'green');
        log('2. Visit your live site and test the admin login\n', 'yellow');
        log('3. Update mockapp URLs to point to your production site\n', 'yellow');
    } else {
        log('\nDeployment failed. Please check the errors above.\n', 'red');
        process.exit(1);
    }
}

// Run deployment
deploy().catch(error => {
    log(`\nUnexpected error: ${error.message}`, 'red');
    process.exit(1);
});


/**
 * Production build script for Teacher Management System
 * 
 * This script:
 * 1. Builds the React client
 * 2. Copies the build to the server's public directory
 * 3. Sets up environment for production
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Helper to log with colors
const log = {
  info: (msg) => console.log(`${colors.cyan}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}${colors.bright}✓ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}${colors.bright}✗ ${msg}${colors.reset}`)
};

// Execute shell commands
function execute(command, cwd) {
  try {
    log.info(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit', cwd: cwd || process.cwd() });
    return true;
  } catch (error) {
    log.error(`Command failed: ${command}`);
    log.error(error.message);
    return false;
  }
}

// Check if .env.production exists
function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.production');
  if (!fs.existsSync(envPath)) {
    log.warning('No .env.production file found. Creating a template...');
    
    const envContent = `# Production Environment Variables
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
`;
    
    fs.writeFileSync(envPath, envContent);
    log.warning('Please update .env.production with your actual values before deploying.');
    return false;
  }
  return true;
}

// Main build function
async function build() {
  log.info('Starting production build process...');
  
  // Check environment file
  const envOk = checkEnvFile();
  if (!envOk) {
    log.warning('Please update your .env.production file and run this script again.');
  }
  
  // Install dependencies
  log.info('Installing dependencies...');
  if (!execute('npm run install-all')) {
    return log.error('Failed to install dependencies. Aborting build.');
  }
  log.success('Dependencies installed');
  
  // Build client
  log.info('Building client application...');
  if (!execute('npm run build:prod', path.join(process.cwd(), 'client'))) {
    return log.error('Failed to build client. Aborting build.');
  }
  log.success('Client built successfully');
  
  // Ensure server uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'server', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    log.info('Creating uploads directory...');
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  log.success('Build completed successfully!');
  log.info('\nTo start the production server:');
  log.info('  npm run prod');
}

// Run the build
build().catch(err => {
  log.error('Build failed with error:');
  console.error(err);
  process.exit(1);
});

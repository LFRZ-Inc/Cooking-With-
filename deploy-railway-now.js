#!/usr/bin/env node

/**
 * 🚀 Quick Railway Deployment for Cooking Ethos AI
 * 
 * This script will help you deploy the Cooking Ethos AI to Railway
 * to fix the 500 error in your Cooking With! app
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Quick Railway Deployment for Cooking Ethos AI\n');

// Check if cooking-ethos-railway directory exists
const DEPLOYMENT_DIR = 'cooking-ethos-railway';
if (!fs.existsSync(DEPLOYMENT_DIR)) {
  console.error(`❌ Directory '${DEPLOYMENT_DIR}' not found!`);
  console.log('\n📝 Please make sure the cooking-ethos-railway directory exists with these files:');
  console.log('   - app.py');
  console.log('   - requirements.txt');
  console.log('   - Procfile');
  console.log('   - runtime.txt');
  process.exit(1);
}

console.log('✅ Found cooking-ethos-railway directory');

// Check if all required files exist
const requiredFiles = ['app.py', 'requirements.txt', 'Procfile', 'runtime.txt'];
const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(DEPLOYMENT_DIR, file)));

if (missingFiles.length > 0) {
  console.error(`❌ Missing required files: ${missingFiles.join(', ')}`);
  process.exit(1);
}

console.log('✅ All required files found');

// Check if Railway CLI is installed
try {
  execSync('railway --version', { stdio: 'ignore' });
  console.log('✅ Railway CLI is installed');
} catch (error) {
  console.error('❌ Railway CLI is not installed. Please install it:');
  console.error('   npm install -g @railway/cli');
  console.error('   Then run: railway login');
  process.exit(1);
}

// Check if user is logged in to Railway
try {
  execSync('railway whoami', { stdio: 'ignore' });
  console.log('✅ Logged in to Railway');
} catch (error) {
  console.error('❌ Not logged in to Railway. Please run:');
  console.error('   railway login');
  process.exit(1);
}

console.log('\n🚀 Starting Railway deployment...\n');

// Change to deployment directory
process.chdir(DEPLOYMENT_DIR);
console.log(`📁 Deploying from: ${path.resolve(DEPLOYMENT_DIR)}`);

// Initialize git if not already done
if (!fs.existsSync('.git')) {
  console.log('🔧 Initializing git repository...');
  try {
    execSync('git init', { stdio: 'inherit' });
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "Initial commit: Cooking Ethos AI"', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Git initialization failed, continuing...');
  }
}

// Create new Railway project
try {
  console.log('🚀 Creating Railway project...');
  execSync('railway init --name "Cooking Ethos AI"', { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️  Project creation failed or already exists, continuing...');
}

// Deploy to Railway
try {
  console.log('🚀 Deploying to Railway...');
  execSync('railway up', { stdio: 'inherit' });
  console.log('\n✅ Deployment successful!');
} catch (error) {
  console.error('\n❌ Deployment failed:', error.message);
  console.log('\n📝 Manual deployment steps:');
  console.log('1. Go to https://railway.app/dashboard');
  console.log('2. Create new project');
  console.log('3. Connect to your GitHub repository');
  console.log('4. Select the cooking-ethos-railway directory');
  console.log('5. Deploy');
  process.exit(1);
}

// Get the deployment URL
try {
  console.log('🔗 Getting deployment URL...');
  const urlOutput = execSync('railway domain', { encoding: 'utf8' });
  const url = urlOutput.trim();
  
  if (url) {
    console.log(`\n🎉 Cooking Ethos AI deployed successfully!`);
    console.log(`🌐 URL: ${url}`);
    console.log(`🔗 Health Check: ${url}/health`);
    console.log(`💬 Chat API: ${url}/api/cooking/chat`);
    
    // Create environment file for easy reference
    const envContent = `# Cooking Ethos AI Railway URL
COOKING_ETHOS_AI_URL=${url}

# Add this to your .env.local file in the Cooking With! app
# This will fix the 500 error in the cooking chat
`;
    
    fs.writeFileSync('../COOKING_ETHOS_AI_ENV.txt', envContent);
    console.log('\n📄 Environment variables saved to COOKING_ETHOS_AI_ENV.txt');
    
    console.log('\n📝 Next steps:');
    console.log('1. Add this environment variable to your Vercel deployment:');
    console.log(`   COOKING_ETHOS_AI_URL=${url}`);
    console.log('\n2. Redeploy your Cooking With! app on Vercel');
    console.log('\n3. Test the cooking chat - it should work now!');
    
  } else {
    console.log('⚠️  Could not retrieve deployment URL');
  }
} catch (error) {
  console.error('❌ Error getting deployment URL:', error.message);
}

console.log('\n🎯 Deployment complete! Your Cooking Ethos AI is now running on Railway.');
console.log('👥 The cooking chat in your Cooking With! app should work now!');

#!/usr/bin/env node

/**
 * 🚀 Direct Railway Deployment for Cooking Ethos AI
 * 
 * This script deploys directly to the existing Railway project
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying Cooking Ethos AI to Railway...\n');

// Configuration
const DEPLOYMENT_DIR = 'cooking-ethos-railway';
const RAILWAY_PROJECT_ID = 'e250ad98-e6f2-4007-8816-e730ad3b8abd';

// Check if deployment directory exists
if (!fs.existsSync(DEPLOYMENT_DIR)) {
  console.error(`❌ Deployment directory '${DEPLOYMENT_DIR}' not found`);
  process.exit(1);
}

// Change to deployment directory
process.chdir(DEPLOYMENT_DIR);
console.log(`📁 Deploying from directory: ${path.resolve(DEPLOYMENT_DIR)}`);

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

// Try to link to existing Railway project
try {
  console.log('🔗 Linking to Railway project...');
  execSync(`railway link --project ${RAILWAY_PROJECT_ID}`, { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️  Could not link to existing project, creating new one...');
  try {
    execSync('railway init', { stdio: 'inherit' });
  } catch (error2) {
    console.log('⚠️  Railway init failed, continuing...');
  }
}

// Deploy to Railway
try {
  console.log('🚀 Deploying to Railway...');
  execSync('railway up', { stdio: 'inherit' });
  console.log('\n✅ Deployment successful!');
} catch (error) {
  console.error('\n❌ Deployment failed:', error.message);
  console.log('\n📝 Manual deployment steps:');
  console.log('1. Go to https://railway.app');
  console.log('2. Create a new project');
  console.log('3. Connect your GitHub repository');
  console.log('4. Deploy the cooking-ethos-railway directory');
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
    
    // Update environment variable for Cooking With! app
    console.log('\n📝 Next steps:');
    console.log('1. Add this environment variable to your Cooking With! app:');
    console.log(`   COOKING_ETHOS_AI_URL=${url}`);
    console.log('\n2. The Cooking With! app will now use the Railway deployment');
    console.log('   instead of local APIs - no server setup required!');
    
    // Create environment file for easy reference
    const envContent = `# Cooking Ethos AI Railway URL
COOKING_ETHOS_AI_URL=${url}

# Add this to your .env.local file in the Cooking With! app
`;
    
    fs.writeFileSync('../COOKING_ETHOS_AI_ENV.txt', envContent);
    console.log('\n📄 Environment variables saved to COOKING_ETHOS_AI_ENV.txt');
    
  } else {
    console.log('⚠️  Could not retrieve deployment URL');
  }
} catch (error) {
  console.error('❌ Error getting deployment URL:', error.message);
}

console.log('\n🎯 Deployment complete! Your Cooking Ethos AI is now running on Railway.');
console.log('👥 Users can now access the cooking assistant without any technical setup!');

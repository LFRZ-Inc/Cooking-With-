// Find Railway URL for Ethos AI
// This script helps identify the correct Railway deployment URL

const fs = require('fs');
const path = require('path');

console.log('🔍 Finding Railway URL for Ethos AI...\n');

// Common Railway URL patterns
const possibleUrls = [
  'https://ethos-ai-backend-production.up.railway.app',
  'https://ethos-ai-production.up.railway.app', 
  'https://ethos-ai.up.railway.app',
  'https://ethos-backend-production.up.railway.app',
  'https://ethos-production.up.railway.app',
  'https://ethos.up.railway.app'
];

console.log('📋 Possible Railway URLs to check:');
possibleUrls.forEach((url, index) => {
  console.log(`${index + 1}. ${url}`);
});

console.log('\n🔧 How to find the correct URL:');
console.log('1. Go to your Railway dashboard: https://railway.app/dashboard');
console.log('2. Find your Ethos AI project');
console.log('3. Click on the project');
console.log('4. Go to "Settings" tab');
console.log('5. Look for "Domains" section');
console.log('6. Copy the production domain URL');

console.log('\n📝 Once you have the correct URL:');
console.log('1. Update the ETHOS_AI_URL in app/api/cooking/chat/route.ts');
console.log('2. Update the RAILWAY_URL in ethos-ai-config.js');
console.log('3. Commit and push the changes');

console.log('\n🧪 Test the URL:');
console.log('You can test if a URL is working by visiting:');
console.log('https://[YOUR-RAILWAY-URL]/health');
console.log('or');
console.log('https://[YOUR-RAILWAY-URL]/api/config');

console.log('\n💡 If you need help:');
console.log('- Check Railway logs for any errors');
console.log('- Restart the deployment if it\'s stuck');
console.log('- Verify the service is actually running');

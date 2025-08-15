// Test Railway URLs for Ethos AI
// This script tests which Railway URLs are actually working

const https = require('https');

const urls = [
  'https://ethos-ai-backend-production.up.railway.app',
  'https://ethos-ai-production.up.railway.app', 
  'https://ethos-ai.up.railway.app',
  'https://ethos-backend-production.up.railway.app',
  'https://ethos-production.up.railway.app',
  'https://ethos.up.railway.app'
];

console.log('🧪 Testing Railway URLs for Ethos AI...\n');

async function testUrl(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const req = https.get(`${url}/health`, (res) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (res.statusCode === 200) {
        console.log(`✅ ${url} - Status: ${res.statusCode} (${responseTime}ms)`);
        resolve({ url, status: 'working', responseTime });
      } else {
        console.log(`⚠️  ${url} - Status: ${res.statusCode} (${responseTime}ms)`);
        resolve({ url, status: 'error', statusCode: res.statusCode, responseTime });
      }
    });
    
    req.on('error', (err) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      console.log(`❌ ${url} - Error: ${err.message} (${responseTime}ms)`);
      resolve({ url, status: 'failed', error: err.message, responseTime });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      console.log(`⏰ ${url} - Timeout (5s)`);
      resolve({ url, status: 'timeout' });
    });
  });
}

async function testAllUrls() {
  const results = [];
  
  for (const url of urls) {
    const result = await testUrl(url);
    results.push(result);
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📊 Results Summary:');
  const working = results.filter(r => r.status === 'working');
  const errors = results.filter(r => r.status === 'error');
  const failed = results.filter(r => r.status === 'failed' || r.status === 'timeout');
  
  if (working.length > 0) {
    console.log(`✅ Working URLs (${working.length}):`);
    working.forEach(r => console.log(`   - ${r.url}`));
  }
  
  if (errors.length > 0) {
    console.log(`⚠️  URLs with errors (${errors.length}):`);
    errors.forEach(r => console.log(`   - ${r.url} (Status: ${r.statusCode})`));
  }
  
  if (failed.length > 0) {
    console.log(`❌ Failed URLs (${failed.length}):`);
    failed.forEach(r => console.log(`   - ${r.url}`));
  }
  
  if (working.length === 0) {
    console.log('\n💡 No working URLs found. You may need to:');
    console.log('1. Check your Railway dashboard for the correct URL');
    console.log('2. Restart your Railway deployment');
    console.log('3. Check Railway logs for errors');
  }
}

testAllUrls();

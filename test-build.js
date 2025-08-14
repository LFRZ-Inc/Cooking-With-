// Simple build test script
console.log('Testing build process...')

// Check if required environment variables are available
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
]

const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars)
  process.exit(1)
}

console.log('✅ All required environment variables are present')
console.log('✅ Build test passed')

// Test Ethos AI URL
const ethosUrl = process.env.ETHOS_AI_URL || 'http://localhost:8000'
console.log('Ethos AI URL:', ethosUrl)

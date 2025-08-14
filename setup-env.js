#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🔧 Cooking With! Environment Setup Helper\n')

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
const envExists = fs.existsSync(envPath)

if (envExists) {
  console.log('✅ .env.local file found')
  
  // Read and check current environment variables
  const envContent = fs.readFileSync(envPath, 'utf8')
  const envVars = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'))
  
  console.log('\n📋 Current Environment Variables:')
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
    'SUPABASE_SERVICE_ROLE_KEY'
  ]
  
  const optionalVars = [
    'LIBRETRANSLATE_URL',
    'LIBRETRANSLATE_API_KEY',
    'NEXT_PUBLIC_SITE_URL',
    'OPENAI_API_KEY'
  ]
  
  let missingRequired = []
  let missingOptional = []
  
  requiredVars.forEach(varName => {
    const hasVar = envVars.some(line => line.startsWith(varName + '='))
    if (hasVar) {
      console.log(`✅ ${varName}: Set`)
    } else {
      console.log(`❌ ${varName}: Missing`)
      missingRequired.push(varName)
    }
  })
  
  optionalVars.forEach(varName => {
    const hasVar = envVars.some(line => line.startsWith(varName + '='))
    if (hasVar) {
      console.log(`✅ ${varName}: Set`)
    } else {
      console.log(`⚠️  ${varName}: Not set (optional)`)
      missingOptional.push(varName)
    }
  })
  
  if (missingRequired.length > 0) {
    console.log('\n❌ Missing required environment variables:')
    missingRequired.forEach(varName => {
      console.log(`   - ${varName}`)
    })
    console.log('\nPlease add these to your .env.local file')
  }
  
  if (missingOptional.length > 0) {
    console.log('\n⚠️  Optional environment variables not set:')
    missingOptional.forEach(varName => {
      console.log(`   - ${varName}`)
    })
    console.log('\nThese are optional but recommended for full functionality')
  }
  
} else {
  console.log('❌ .env.local file not found')
  console.log('\n📝 Creating .env.local template...')
  
  const template = `# Cooking With! Environment Variables

# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Translation System (OPTIONAL - will use fallback if not set)
LIBRETRANSLATE_URL=https://libretranslate.com
LIBRETRANSLATE_API_KEY=your_libretranslate_api_key_here

# AI Food Recognition (OPTIONAL - required for food photo analysis)
OPENAI_API_KEY=your_openai_api_key_here

# Site URL for server-side API calls
NEXT_PUBLIC_SITE_URL=http://localhost:3000
`
  
  fs.writeFileSync(envPath, template)
  console.log('✅ Created .env.local template')
  console.log('\n📋 Please update the values in .env.local with your actual credentials')
}

console.log('\n🔗 Useful Links:')
console.log('• Supabase Dashboard: https://supabase.com/dashboard')
console.log('• LibreTranslate: https://libretranslate.com')
console.log('• Database Migration: lib/complete-database-migration.sql')

console.log('\n📋 Next Steps:')
console.log('1. Update .env.local with your credentials')
console.log('2. Run the database migration in Supabase SQL Editor')
console.log('3. Test the system: node test-complete-system.js')
console.log('4. Start the dev server: npm run dev')

console.log('\n🎯 Current Status:')
console.log('✅ Translation System: Ready (using fallback services)')
console.log('✅ AI Food Recognition: Ready (requires OpenAI API key)')
console.log('❌ Database Tables: Need migration')
console.log('❌ Recipe Import: Waiting for database')
console.log('❌ Environment Variables: Need configuration')

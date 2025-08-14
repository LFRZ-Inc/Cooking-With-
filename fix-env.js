#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🔧 Fixing Environment Variables...\n')

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
const envExists = fs.existsSync(envPath)

if (!envExists) {
  console.log('❌ .env.local file not found')
  console.log('Creating .env.local with proper format...')
  
  const template = `# Cooking With! Environment Variables

# Supabase Configuration (REQUIRED)
# Make sure the URL starts with https:// and ends with .supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Translation System (OPTIONAL - will use fallback if not set)
LIBRETRANSLATE_URL=https://libretranslate.com
LIBRETRANSLATE_API_KEY=your_libretranslate_api_key_here

# Site URL for server-side API calls
NEXT_PUBLIC_SITE_URL=http://localhost:3000
`
  
  fs.writeFileSync(envPath, template)
  console.log('✅ Created .env.local template')
  console.log('\n📋 Please update the values in .env.local with your actual credentials')
  console.log('   Make sure the Supabase URL is in the format: https://your-project-id.supabase.co')
  return
}

// Read current environment variables
const envContent = fs.readFileSync(envPath, 'utf8')
const envLines = envContent.split('\n')

console.log('📋 Checking current environment variables...\n')

let hasIssues = false
let updatedContent = ''

envLines.forEach(line => {
  if (line.trim() && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=')
    const value = valueParts.join('=')
    
    if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
      if (!value || value === 'your_supabase_url_here' || value === 'your-project-id.supabase.co') {
        console.log(`❌ ${key}: Not set or using placeholder`)
        console.log(`   Should be: https://your-project-id.supabase.co`)
        hasIssues = true
        updatedContent += `${key}=https://your-project-id.supabase.co\n`
      } else if (!value.startsWith('https://') || !value.includes('.supabase.co')) {
        console.log(`❌ ${key}: Invalid format`)
        console.log(`   Current: ${value}`)
        console.log(`   Should be: https://your-project-id.supabase.co`)
        hasIssues = true
        updatedContent += `${key}=https://your-project-id.supabase.co\n`
      } else {
        console.log(`✅ ${key}: Valid format`)
        updatedContent += line + '\n'
      }
    } else if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
      if (!value || value === 'your_supabase_anon_key_here' || value === 'your_anon_key_here') {
        console.log(`❌ ${key}: Not set or using placeholder`)
        hasIssues = true
        updatedContent += `${key}=your_anon_key_here\n`
      } else if (value.length < 100) {
        console.log(`❌ ${key}: Too short (likely invalid)`)
        console.log(`   Should be a long JWT token`)
        hasIssues = true
        updatedContent += `${key}=your_anon_key_here\n`
      } else {
        console.log(`✅ ${key}: Set`)
        updatedContent += line + '\n'
      }
    } else if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
      if (!value || value === 'your_service_role_key_here') {
        console.log(`❌ ${key}: Not set or using placeholder`)
        hasIssues = true
        updatedContent += `${key}=your_service_role_key_here\n`
      } else if (value.length < 100) {
        console.log(`❌ ${key}: Too short (likely invalid)`)
        console.log(`   Should be a long JWT token`)
        hasIssues = true
        updatedContent += `${key}=your_service_role_key_here\n`
      } else {
        console.log(`✅ ${key}: Set`)
        updatedContent += line + '\n'
      }
    } else {
      updatedContent += line + '\n'
    }
  } else {
    updatedContent += line + '\n'
  }
})

if (hasIssues) {
  console.log('\n🔧 Fixing environment variables...')
  fs.writeFileSync(envPath, updatedContent)
  console.log('✅ Updated .env.local with proper format')
  console.log('\n📋 Please update the placeholder values with your actual Supabase credentials')
} else {
  console.log('\n✅ All environment variables look good!')
}

console.log('\n🔗 How to get your Supabase credentials:')
console.log('1. Go to https://supabase.com/dashboard')
console.log('2. Select your project')
console.log('3. Go to Settings > API')
console.log('4. Copy the Project URL and anon/public key')
console.log('5. Update .env.local with these values')

console.log('\n📋 Example .env.local format:')
console.log('NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co')
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
console.log('SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')

console.log('\n🎯 Next steps:')
console.log('1. Update .env.local with your actual Supabase credentials')
console.log('2. Run the database migration: lib/complete-database-migration.sql')
console.log('3. Test the system: node test-complete-system.js')

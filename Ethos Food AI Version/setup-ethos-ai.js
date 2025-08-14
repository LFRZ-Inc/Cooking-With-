#!/usr/bin/env node

/**
 * Ethos AI Setup Script for Cooking With!
 * 
 * This script helps set up Ethos AI for the food recognition feature.
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🍳 Ethos AI Setup for Cooking With!\n')

// Check if we're in the right directory
const currentDir = process.cwd()
const isCookingWithDir = fs.existsSync(path.join(currentDir, 'package.json')) && 
                        fs.existsSync(path.join(currentDir, 'app'))

if (!isCookingWithDir) {
  console.log('❌ Error: This script must be run from the Cooking With! project root directory')
  console.log('Please navigate to the Cooking With! directory and try again.')
  process.exit(1)
}

console.log('✅ Cooking With! project detected\n')

// Check if Ethos AI is already cloned
const ethosDir = path.join(currentDir, 'Ethos-AI')
const ethosExists = fs.existsSync(ethosDir)

if (ethosExists) {
  console.log('✅ Ethos AI repository already exists')
} else {
  console.log('📥 Cloning Ethos AI repository...')
  try {
    execSync('git clone https://github.com/LFRZ-Inc/Ethos-AI.git', { stdio: 'inherit' })
    console.log('✅ Ethos AI repository cloned successfully')
  } catch (error) {
    console.log('❌ Failed to clone Ethos AI repository')
    console.log('Please ensure git is installed and you have internet connectivity')
    process.exit(1)
  }
}

// Check Python installation
console.log('\n🐍 Checking Python installation...')
try {
  const pythonVersion = execSync('python --version', { encoding: 'utf8' })
  console.log(`✅ Python found: ${pythonVersion.trim()}`)
} catch (error) {
  console.log('❌ Python not found')
  console.log('Please install Python 3.8+ from https://python.org')
  process.exit(1)
}

// Check pip installation
console.log('\n📦 Checking pip installation...')
try {
  const pipVersion = execSync('pip --version', { encoding: 'utf8' })
  console.log(`✅ pip found: ${pipVersion.trim()}`)
} catch (error) {
  console.log('❌ pip not found')
  console.log('Please install pip or upgrade Python')
  process.exit(1)
}

// Install Python dependencies
console.log('\n📦 Installing Ethos AI Python dependencies...')
try {
  process.chdir(ethosDir)
  execSync('pip install -r requirements.txt', { stdio: 'inherit' })
  console.log('✅ Python dependencies installed successfully')
} catch (error) {
  console.log('❌ Failed to install Python dependencies')
  console.log('Please check the error messages above and try again')
  process.exit(1)
}

// Check Ollama installation
console.log('\n🤖 Checking Ollama installation...')
try {
  const ollamaVersion = execSync('ollama --version', { encoding: 'utf8' })
  console.log(`✅ Ollama found: ${ollamaVersion.trim()}`)
} catch (error) {
  console.log('❌ Ollama not found')
  console.log('Please install Ollama from https://ollama.ai/download')
  console.log('After installation, restart your terminal and run this script again')
  process.exit(1)
}

// Download required models
console.log('\n📥 Downloading required AI models...')
const models = ['llava:7b', 'llama3.2:3b']

for (const model of models) {
  console.log(`📥 Downloading ${model}...`)
  try {
    execSync(`ollama pull ${model}`, { stdio: 'inherit' })
    console.log(`✅ ${model} downloaded successfully`)
  } catch (error) {
    console.log(`❌ Failed to download ${model}`)
    console.log('This may take a while depending on your internet connection')
    console.log('You can manually download it later with: ollama pull ' + model)
  }
}

// Return to original directory
process.chdir(currentDir)

// Check environment configuration
console.log('\n⚙️ Checking environment configuration...')
const envPath = path.join(currentDir, '.env.local')
const envExists = fs.existsSync(envPath)

if (envExists) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  if (envContent.includes('ETHOS_AI_URL')) {
    console.log('✅ ETHOS_AI_URL already configured')
  } else {
    console.log('⚠️ ETHOS_AI_URL not found in .env.local')
    console.log('Adding ETHOS_AI_URL configuration...')
    
    const newEnvContent = envContent + '\n# Ethos AI Configuration\nETHOS_AI_URL=http://localhost:8000\n'
    fs.writeFileSync(envPath, newEnvContent)
    console.log('✅ ETHOS_AI_URL added to .env.local')
  }
} else {
  console.log('⚠️ .env.local file not found')
  console.log('Creating .env.local with Ethos AI configuration...')
  
  const envTemplate = `# Cooking With! Environment Variables

# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Translation System (OPTIONAL)
LIBRETRANSLATE_URL=https://libretranslate.com
LIBRETRANSLATE_API_KEY=your_libretranslate_api_key_here

# AI Food Recognition (OPTIONAL - choose one)
# Option 1: OpenAI (requires API key and costs tokens)
OPENAI_API_KEY=your_openai_api_key_here
# Option 2: Ethos AI (local, free, requires Ethos AI server running)
ETHOS_AI_URL=http://localhost:8000

# Site URL for server-side API calls
NEXT_PUBLIC_SITE_URL=http://localhost:3000
`
  
  fs.writeFileSync(envPath, envTemplate)
  console.log('✅ Created .env.local with Ethos AI configuration')
}

// Create startup script
console.log('\n📝 Creating startup scripts...')

const startEthosScript = `@echo off
echo Starting Ethos AI server...
cd "${ethosDir.replace(/\\/g, '\\\\')}"
python backend/main.py
pause
`

const startEthosPath = path.join(currentDir, 'start-ethos-ai.bat')
fs.writeFileSync(startEthosPath, startEthosScript)
console.log('✅ Created start-ethos-ai.bat')

// Create test script
const testScript = `@echo off
echo Testing Ethos AI connection...
curl -X GET http://localhost:8000/health
echo.
echo If you see a response, Ethos AI is running correctly.
pause
`

const testPath = path.join(currentDir, 'test-ethos-ai.bat')
fs.writeFileSync(testPath, testScript)
console.log('✅ Created test-ethos-ai.bat')

console.log('\n🎉 Ethos AI setup completed successfully!\n')

console.log('📋 Next Steps:')
console.log('1. Start the Ethos AI server:')
console.log('   - Run: start-ethos-ai.bat')
console.log('   - Or manually: cd Ethos-AI && python backend/main.py')
console.log('')
console.log('2. Test the connection:')
console.log('   - Run: test-ethos-ai.bat')
console.log('   - Or manually: curl http://localhost:8000/health')
console.log('')
console.log('3. Start your Cooking With! application:')
console.log('   - Run: npm run dev')
console.log('')
console.log('4. Test the food recognition feature:')
console.log('   - Go to the recipe import page')
console.log('   - Select "AI Food Recognition"')
console.log('   - Upload a photo of cooked food')
console.log('')
console.log('📚 For more information, see:')
console.log('   - Ethos Food AI Version/README.md')
console.log('   - https://github.com/LFRZ-Inc/Ethos-AI')
console.log('')
console.log('✨ Enjoy cost-free food recognition with Ethos AI!')

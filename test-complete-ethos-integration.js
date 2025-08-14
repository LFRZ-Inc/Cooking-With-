#!/usr/bin/env node

/**
 * Comprehensive Test Script for Ethos AI Integration
 * Tests all components of the Cooking With! app with Ethos AI
 */

const fs = require('fs')
const path = require('path')

console.log('🧪 Testing Complete Ethos AI Integration...\n')

// Test configuration
const config = {
  ethosAiUrl: 'https://ethos-ai-backend-production.up.railway.app',
  testImageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
  testRecipeText: `
Chocolate Chip Cookies

Ingredients:
- 2 1/4 cups all-purpose flour
- 1 tsp baking soda
- 1 tsp salt
- 1 cup butter, softened
- 3/4 cup granulated sugar
- 3/4 cup brown sugar
- 2 large eggs
- 2 tsp vanilla extract
- 2 cups chocolate chips

Instructions:
1. Preheat oven to 375°F (190°C)
2. Mix flour, baking soda, and salt in a bowl
3. Cream butter and sugars until fluffy
4. Beat in eggs and vanilla
5. Gradually mix in flour mixture
6. Stir in chocolate chips
7. Drop rounded tablespoons onto ungreased baking sheets
8. Bake for 9-11 minutes until golden brown
9. Cool on baking sheets for 2 minutes
10. Transfer to wire racks to cool completely

Prep time: 15 minutes
Cook time: 10 minutes
Servings: 24 cookies
  `.trim()
}

// Test functions
async function testEthosAIConnection() {
  console.log('🔗 Testing Ethos AI Connection...')
  
  try {
    const response = await fetch(`${config.ethosAiUrl}/health`)
    if (response.ok) {
      console.log('✅ Ethos AI is accessible')
      return true
    } else {
      console.log('❌ Ethos AI health check failed')
      return false
    }
  } catch (error) {
    console.log('❌ Ethos AI connection failed:', error.message)
    return false
  }
}

async function testEthosAIChat() {
  console.log('💬 Testing Ethos AI Chat...')
  
  try {
    const response = await fetch(`${config.ethosAiUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'Hello, can you help me with a recipe?',
        model_override: 'llama3.2:3b'
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Ethos AI chat working')
      return true
    } else {
      console.log('❌ Ethos AI chat failed')
      return false
    }
  } catch (error) {
    console.log('❌ Ethos AI chat error:', error.message)
    return false
  }
}

async function testRecipeParser() {
  console.log('📝 Testing Recipe Parser...')
  
  try {
    const response = await fetch('/api/recipes/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        import_type: 'text',
        source_data: config.testRecipeText,
        user_id: 'test-user',
        use_ethos_ai: true,
        auto_translate: false
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Recipe parser working')
      console.log(`   - Title: ${result.recipe.title}`)
      console.log(`   - Ingredients: ${result.recipe.ingredients.length}`)
      console.log(`   - Instructions: ${result.recipe.instructions.length}`)
      console.log(`   - Provider: ${result.recipe.provider}`)
      return true
    } else {
      const error = await response.json()
      console.log('❌ Recipe parser failed:', error.error)
      return false
    }
  } catch (error) {
    console.log('❌ Recipe parser error:', error.message)
    return false
  }
}

async function testFoodRecognition() {
  console.log('🍽️ Testing Food Recognition...')
  
  try {
    const response = await fetch('/api/recipes/ethos-food-recognition', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: config.testImageUrl,
        user_id: 'test-user',
        user_preferences: {},
        auto_save: false
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Food recognition working')
      console.log(`   - Dish: ${result.recipe.title}`)
      console.log(`   - Confidence: ${result.analysis.confidence}`)
      console.log(`   - Provider: ${result.provider}`)
      return true
    } else {
      const error = await response.json()
      console.log('❌ Food recognition failed:', error.error)
      return false
    }
  } catch (error) {
    console.log('❌ Food recognition error:', error.message)
    return false
  }
}

async function testUploadAPI() {
  console.log('📤 Testing Upload API...')
  
  try {
    // Create a simple test file
    const testFile = new Blob(['test image content'], { type: 'image/jpeg' })
    const formData = new FormData()
    formData.append('file', testFile, 'test.jpg')
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Upload API working')
      console.log(`   - URL: ${result.url}`)
      return true
    } else {
      const error = await response.json()
      console.log('❌ Upload API failed:', error.error)
      return false
    }
  } catch (error) {
    console.log('❌ Upload API error:', error.message)
    return false
  }
}

async function testEnvironmentVariables() {
  console.log('🔧 Testing Environment Variables...')
  
  const requiredVars = [
    'ETHOS_AI_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]
  
  const missing = requiredVars.filter(varName => !process.env[varName])
  
  if (missing.length === 0) {
    console.log('✅ All required environment variables are set')
    return true
  } else {
    console.log('❌ Missing environment variables:', missing.join(', '))
    return false
  }
}

async function testDatabaseConnection() {
  console.log('🗄️ Testing Database Connection...')
  
  try {
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    const { data, error } = await supabase
      .from('recipes')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('❌ Database connection failed:', error.message)
      return false
    } else {
      console.log('✅ Database connection working')
      return true
    }
  } catch (error) {
    console.log('❌ Database connection error:', error.message)
    return false
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Comprehensive Ethos AI Integration Tests...\n')
  
  const tests = [
    { name: 'Environment Variables', fn: testEnvironmentVariables },
    { name: 'Database Connection', fn: testDatabaseConnection },
    { name: 'Ethos AI Connection', fn: testEthosAIConnection },
    { name: 'Ethos AI Chat', fn: testEthosAIChat },
    { name: 'Recipe Parser', fn: testRecipeParser },
    { name: 'Food Recognition', fn: testFoodRecognition },
    { name: 'Upload API', fn: testUploadAPI }
  ]
  
  const results = []
  
  for (const test of tests) {
    console.log(`\n--- ${test.name} ---`)
    const result = await test.fn()
    results.push({ name: test.name, passed: result })
  }
  
  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 TEST SUMMARY')
  console.log('='.repeat(50))
  
  const passed = results.filter(r => r.passed).length
  const total = results.length
  
  results.forEach(result => {
    const status = result.passed ? '✅' : '❌'
    console.log(`${status} ${result.name}`)
  })
  
  console.log(`\n${passed}/${total} tests passed`)
  
  if (passed === total) {
    console.log('🎉 All tests passed! Your Ethos AI integration is working perfectly!')
    process.exit(0)
  } else {
    console.log('⚠️ Some tests failed. Please check the errors above.')
    process.exit(1)
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('Test runner error:', error)
    process.exit(1)
  })
}

module.exports = {
  testEthosAIConnection,
  testEthosAIChat,
  testRecipeParser,
  testFoodRecognition,
  testUploadAPI,
  testEnvironmentVariables,
  testDatabaseConnection,
  runAllTests
}

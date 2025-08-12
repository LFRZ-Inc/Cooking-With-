// Test script to verify translation functionality
const testTranslation = async () => {
  try {
    console.log('Testing translation API...')
    
    const response = await fetch('http://localhost:3000/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'Hello world',
        targetLanguage: 'es',
        sourceLanguage: 'en'
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Translation API error:', response.status, errorText)
      return false
    }

    const result = await response.json()
    console.log('Translation result:', result)
    
    if (result.translatedText) {
      console.log('✅ Translation API is working!')
      return true
    } else {
      console.log('❌ Translation API returned no translated text')
      return false
    }
  } catch (error) {
    console.error('❌ Translation API test failed:', error)
    return false
  }
}

// Test recipe import API
const testRecipeImport = async () => {
  try {
    console.log('\nTesting recipe import API...')
    
    const response = await fetch('http://localhost:3000/api/recipes/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        import_type: 'text',
        source_data: `
Chocolate Chip Cookies

Ingredients:
- 2 1/4 cups all-purpose flour
- 1 cup butter, softened
- 3/4 cup granulated sugar
- 3/4 cup brown sugar
- 2 large eggs
- 1 tsp vanilla extract
- 1 tsp baking soda
- 1/2 tsp salt
- 2 cups chocolate chips

Instructions:
1. Preheat oven to 375°F
2. Cream butter and sugars together
3. Beat in eggs and vanilla
4. Mix in dry ingredients
5. Stir in chocolate chips
6. Drop by rounded tablespoons onto ungreased baking sheets
7. Bake for 9-11 minutes
        `,
        user_id: 'test-user-id',
        auto_translate: false,
        target_language: 'en'
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Recipe import API error:', response.status, errorText)
      return false
    }

    const result = await response.json()
    console.log('Recipe import result:', result)
    
    if (result.recipe && result.recipe.title) {
      console.log('✅ Recipe import API is working!')
      return true
    } else {
      console.log('❌ Recipe import API returned no recipe')
      return false
    }
  } catch (error) {
    console.error('❌ Recipe import API test failed:', error)
    return false
  }
}

// Run tests
const runTests = async () => {
  console.log('🧪 Running functionality tests...\n')
  
  const translationWorks = await testTranslation()
  const importWorks = await testRecipeImport()
  
  console.log('\n📊 Test Results:')
  console.log(`Translation API: ${translationWorks ? '✅ Working' : '❌ Failed'}`)
  console.log(`Recipe Import API: ${importWorks ? '✅ Working' : '❌ Failed'}`)
  
  if (translationWorks && importWorks) {
    console.log('\n🎉 All tests passed! The system is working correctly.')
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.')
  }
}

// Run if this file is executed directly
if (typeof window === 'undefined') {
  runTests()
}

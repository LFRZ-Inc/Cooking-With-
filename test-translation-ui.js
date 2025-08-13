// Test script to verify UI translation system
// Run this in the browser console to test translations

console.log('Testing UI Translation System...')

// Test 1: Check if language is being set correctly
function testLanguageSwitching() {
  console.log('=== Testing Language Switching ===')
  
  // Check current language
  const currentLang = localStorage.getItem('language') || 'en'
  console.log('Current language in localStorage:', currentLang)
  
  // Check if translations are loaded
  const testKey = 'navigation.recipes'
  const testElement = document.querySelector('[data-testid="nav-recipes"]') || 
                     document.querySelector('a[href="/recipes"] span')
  
  if (testElement) {
    console.log('Navigation recipes text:', testElement.textContent)
  } else {
    console.log('Could not find navigation recipes element')
  }
  
  // Test switching to Spanish
  console.log('Switching to Spanish...')
  localStorage.setItem('language', 'es')
  window.location.reload()
}

// Test 2: Check if translation files are accessible
async function testTranslationFiles() {
  console.log('=== Testing Translation Files ===')
  
  try {
    const enResponse = await fetch('/locales/en/common.json')
    const enData = await enResponse.json()
    console.log('English translations loaded:', Object.keys(enData).length, 'sections')
    
    const esResponse = await fetch('/locales/es/common.json')
    const esData = await esResponse.json()
    console.log('Spanish translations loaded:', Object.keys(esData).length, 'sections')
    
    // Test specific translations
    console.log('English "recipes":', enData.navigation?.recipes)
    console.log('Spanish "recipes":', esData.navigation?.recipes)
    
  } catch (error) {
    console.error('Error loading translation files:', error)
  }
}

// Test 3: Check React context
function testReactContext() {
  console.log('=== Testing React Context ===')
  
  // This would need to be run in a React component context
  console.log('React context test requires component context')
}

// Run tests
testTranslationFiles()
  .then(() => {
    console.log('Translation file test completed')
  })
  .catch(error => {
    console.error('Translation file test failed:', error)
  })

// Uncomment to test language switching (will reload page)
// testLanguageSwitching()

console.log('UI Translation tests ready. Run testLanguageSwitching() to test language switching.')

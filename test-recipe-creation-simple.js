// Test script to verify recipe creation via API endpoint
const fetch = require('node-fetch');

async function testRecipeCreationAPI() {
  try {
    console.log('Testing recipe creation via API endpoint...');
    
    // Test data for recipe creation
    const testData = {
      title: "Test Recipe - API Test",
      description: "A test recipe created via the API endpoint",
      author_id: "80036c8e-abee-416c-8a80-3874b10f8eb1", // Real user ID from database
      difficulty: "medium",
      prep_time_minutes: 15,
      cook_time_minutes: 30,
      servings: 4,
      instructions: ["Step 1: Test the API", "Step 2: Verify it works"],
      tips: "This is a test recipe",
      image_url: null,
      ingredients: [
        {
          name: "Test ingredient",
          amount: 1,
          unit: "cup",
          notes: null
        }
      ],
      categories: []
    };

    console.log('Sending request to API...');
    
    const response = await fetch('http://localhost:3000/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Recipe created successfully!');
      console.log('Recipe ID:', result.id);
      return result;
    } else {
      const errorText = await response.text();
      console.error('❌ Failed to create recipe');
      console.error('Status:', response.status);
      console.error('Error:', errorText);
      return null;
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return null;
  }
}

testRecipeCreationAPI();

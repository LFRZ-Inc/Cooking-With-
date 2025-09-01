// Test script to verify recipe creation works
const fetch = require('node-fetch');

async function createTestUser() {
  try {
    const userData = {
      email: "test@example.com",
      full_name: "Test User"
    };

    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    if (response.ok) {
      const result = await response.json();
      return result.user.id;
    } else {
      console.log('Failed to create test user, trying to get existing user...');
      // Try to get existing users
      const usersResponse = await fetch('http://localhost:3000/api/users');
      if (usersResponse.ok) {
        const users = await usersResponse.json();
        if (users.users && users.users.length > 0) {
          return users.users[0].id;
        }
      }
      throw new Error('No users available');
    }
  } catch (error) {
    console.log('Error with user creation/retrieval:', error.message);
    return null;
  }
}

async function testRecipeCreation() {
  try {
    console.log('Testing recipe creation API...');
    
    // First, get or create a test user
    const userId = await createTestUser();
    if (!userId) {
      console.log('❌ Could not get a valid user ID for testing');
      return;
    }
    
    console.log('Using user ID:', userId);
    
    const testData = {
      title: "Test Recipe",
      description: "A test recipe to verify the API works",
      author_id: userId,
      difficulty: "medium",
      prep_time_minutes: 15,
      cook_time_minutes: 30,
      servings: 4,
      instructions: ["Step 1: Test", "Step 2: Verify"],
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

    const response = await fetch('http://localhost:3000/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Recipe creation successful!');
      console.log('Recipe ID:', result.recipe.id);
      console.log('Ingredients count:', result.recipe.ingredients?.length || 0);
    } else {
      const error = await response.json();
      console.log('❌ Recipe creation failed:');
      console.log('Status:', response.status);
      console.log('Error:', error);
    }
  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
  }
}

testRecipeCreation();

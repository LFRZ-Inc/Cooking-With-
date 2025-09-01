// Test script to verify recipe creation works with real user ID
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://aenfbkvdazgcnizdqlrs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlbmZia3ZkYXpnY25pemRxbHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMTI0NDUsImV4cCI6MjA2OTU4ODQ0NX0.rCXbPSGIsITmVC9LFT36nzmYE3b5ALKFpb6cni2Ajmk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRecipeCreation() {
  try {
    console.log('Testing recipe creation with real user ID...');
    
    // First, get a real user ID
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email')
      .limit(1);
    
    if (usersError || !users || users.length === 0) {
      console.error('Failed to get user:', usersError);
      return;
    }
    
    const userId = users[0].id;
    console.log('Using user ID:', userId);
    
    // Test recipe creation
    const testData = {
      title: "Test Recipe - API Fixed",
      description: "A test recipe to verify the API works correctly",
      author_id: userId,
      difficulty: "medium",
      prep_time_minutes: 15,
      cook_time_minutes: 30,
      servings: 4,
      instructions: ["Step 1: Test the API", "Step 2: Verify it works"],
      tips: "This is a test recipe created via API",
      image_url: null,
      ingredients: [
        {
          name: "Test ingredient",
          amount: 1,
          unit: "cup",
          notes: null
        },
        {
          name: "Another ingredient",
          amount: 2,
          unit: "tbsp",
          notes: "Optional"
        }
      ],
      categories: []
    };

    console.log('Creating recipe with data:', JSON.stringify(testData, null, 2));
    
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .insert([{
        title: testData.title,
        description: testData.description,
        author_id: testData.author_id,
        difficulty: testData.difficulty,
        prep_time_minutes: testData.prep_time_minutes,
        cook_time_minutes: testData.cook_time_minutes,
        servings: testData.servings,
        instructions: testData.instructions,
        tips: testData.tips,
        image_url: testData.image_url,
        status: 'draft',
        rating: 0,
        rating_count: 0,
        view_count: 0,
        version_number: 1,
        parent_recipe_id: null,
        is_original: true,
        branch_name: null
      }])
      .select()
      .single();

    if (recipeError) {
      console.error('Failed to create recipe:', recipeError);
      return;
    }

    console.log('✓ Recipe created successfully:', recipe.id);
    
    // Create ingredients
    if (testData.ingredients.length > 0) {
      const ingredientsData = testData.ingredients.map((ingredient, index) => ({
        recipe_id: recipe.id,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        notes: ingredient.notes,
        order_index: index
      }));

      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .insert(ingredientsData);

      if (ingredientsError) {
        console.error('Failed to create ingredients:', ingredientsError);
      } else {
        console.log('✓ Ingredients created successfully');
      }
    }
    
    console.log('🎉 Recipe creation test completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testRecipeCreation();

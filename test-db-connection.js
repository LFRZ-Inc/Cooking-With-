// Test script to check database connection and users
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://aenfbkvdazgcnizdqlrs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlbmZia3ZkYXpnY25pemRxbHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMTI0NDUsImV4cCI6MjA2OTU4ODQ0NX0.rCXbPSGIsITmVC9LFT36nzmYE3b5ALKFpb6cni2Ajmk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test 1: Check if we can connect to the database
    console.log('\n1. Testing basic connection...');
    const { data: testData, error: testError } = await supabase
      .from('recipes')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('Connection error:', testError);
      return;
    }
    console.log('✓ Database connection successful');
    
    // Test 2: Check users table
    console.log('\n2. Checking users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, full_name')
      .limit(5);
    
    if (usersError) {
      console.error('Users table error:', usersError);
    } else {
      console.log('Users found:', users?.length || 0);
      if (users && users.length > 0) {
        console.log('Sample user:', users[0]);
      }
    }
    
    // Test 3: Check recipes table
    console.log('\n3. Checking recipes table...');
    const { data: recipes, error: recipesError } = await supabase
      .from('recipes')
      .select('id, title, author_id')
      .limit(5);
    
    if (recipesError) {
      console.error('Recipes table error:', recipesError);
    } else {
      console.log('Recipes found:', recipes?.length || 0);
      if (recipes && recipes.length > 0) {
        console.log('Sample recipe:', recipes[0]);
      }
    }
    
    // Test 4: Check recipe_ingredients table
    console.log('\n4. Checking recipe_ingredients table...');
    const { data: ingredients, error: ingredientsError } = await supabase
      .from('recipe_ingredients')
      .select('*')
      .limit(5);
    
    if (ingredientsError) {
      console.error('Recipe ingredients table error:', ingredientsError);
    } else {
      console.log('Recipe ingredients found:', ingredients?.length || 0);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testDatabaseConnection();

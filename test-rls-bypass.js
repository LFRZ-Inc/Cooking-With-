// Test script to check RLS bypass options
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://aenfbkvdazgcnizdqlrs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlbmZia3ZkYXpnY25pemRxbHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMTI0NDUsImV4cCI6MjA2OTU4ODQ0NX0.rCXbPSGIsITmVC9LFT36nzmYE3b5ALKFpb6cni2Ajmk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRLSBypass() {
  try {
    console.log('Testing RLS bypass options...');
    
    // Test 1: Check if we can read recipes (should work)
    console.log('\n1. Testing recipe read access...');
    const { data: recipes, error: readError } = await supabase
      .from('recipes')
      .select('*')
      .limit(1);
    
    if (readError) {
      console.error('Read error:', readError);
    } else {
      console.log('✓ Read access works');
    }
    
    // Test 2: Try to create a recipe with a valid user ID
    console.log('\n2. Testing recipe creation with valid user...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (usersError || !users || users.length === 0) {
      console.error('Failed to get users:', usersError);
      return;
    }
    
    const userId = users[0].id;
    console.log('Using user ID:', userId);
    
    const testRecipe = {
      title: "Test Recipe - RLS Test",
      description: "Testing RLS bypass",
      author_id: userId,
      difficulty: "medium",
      prep_time_minutes: 15,
      cook_time_minutes: 30,
      servings: 4,
      instructions: ["Step 1", "Step 2"],
      tips: "Test recipe",
      image_url: null,
      status: 'draft',
      rating: 0,
      rating_count: 0,
      view_count: 0,
      version_number: 1,
      parent_recipe_id: null,
      is_original: true,
      branch_name: null
    };
    
    const { data: recipe, error: createError } = await supabase
      .from('recipes')
      .insert([testRecipe])
      .select()
      .single();
    
    if (createError) {
      console.error('Create error:', createError);
      console.log('This confirms RLS is blocking the insert');
    } else {
      console.log('✓ Recipe created successfully:', recipe.id);
      
      // Clean up - delete the test recipe
      await supabase
        .from('recipes')
        .delete()
        .eq('id', recipe.id);
    }
    
    // Test 3: Check RLS policies
    console.log('\n3. RLS Policy Analysis:');
    console.log('- The error code 42501 indicates a row-level security policy violation');
    console.log('- This means the current user/session does not have permission to insert');
    console.log('- Solutions:');
    console.log('  1. Use service role key (bypasses RLS)');
    console.log('  2. Modify RLS policies to allow inserts');
    console.log('  3. Ensure proper authentication in API routes');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testRLSBypass();

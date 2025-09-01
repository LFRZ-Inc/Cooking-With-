// Test script to verify service role key works
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://aenfbkvdazgcnizdqlrs.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlbmZia3ZkYXpnY25pemRxbHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDAxMjQ0NSwiZXhwIjoyMDY5NTg4NDQ1fQ.wp9iZrLjFEg7qKhuM8Iwn8BgmVm5AOwIi-B05DMqCBA';

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testServiceRole() {
  try {
    console.log('Testing service role key...');
    
    // Test 1: Get a user ID
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id')
      .limit(1);
    
    if (usersError || !users || users.length === 0) {
      console.error('Failed to get users:', usersError);
      return;
    }
    
    const userId = users[0].id;
    console.log('Using user ID:', userId);
    
    // Test 2: Create a recipe with service role key
    const testRecipe = {
      title: "Test Recipe - Service Role",
      description: "Testing service role key",
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
    
    console.log('Creating recipe...');
    const { data: recipe, error: createError } = await supabaseAdmin
      .from('recipes')
      .insert([testRecipe])
      .select()
      .single();
    
    if (createError) {
      console.error('❌ Create error:', createError);
    } else {
      console.log('✅ Recipe created successfully:', recipe.id);
      
      // Clean up - delete the test recipe
      await supabaseAdmin
        .from('recipes')
        .delete()
        .eq('id', recipe.id);
      console.log('✅ Test recipe cleaned up');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testServiceRole();

-- Complete Database Migration for Cooking With! Platform
-- This script creates all necessary tables for the complete system

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Create users table (if not exists)
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
    prep_time_minutes INTEGER DEFAULT 0,
    cook_time_minutes INTEGER DEFAULT 0,
    servings INTEGER DEFAULT 4,
    instructions TEXT[] NOT NULL,
    tips TEXT,
    image_url TEXT,
    status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
    rating DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    version_number INTEGER DEFAULT 1,
    parent_recipe_id UUID REFERENCES recipes(id),
    is_original BOOLEAN DEFAULT true,
    branch_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipe_ingredients table
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount DECIMAL(10,2),
    unit TEXT,
    notes TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipe_categories table (many-to-many)
CREATE TABLE IF NOT EXISTS recipe_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(recipe_id, category_id)
);

-- Create newsletters table
CREATE TABLE IF NOT EXISTS newsletters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- RECIPE IMPORT SYSTEM TABLES
-- =====================================================

-- Create recipe_imports table
CREATE TABLE IF NOT EXISTS recipe_imports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_url TEXT,
    source_domain TEXT,
    import_method TEXT NOT NULL CHECK (import_method IN ('webpage', 'image', 'text')),
    original_content TEXT NOT NULL,
    import_metadata JSONB,
    import_status TEXT CHECK (import_status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
    confidence_score DECIMAL(3,2) DEFAULT 0,
    field_mapping JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create import_sources table
CREATE TABLE IF NOT EXISTS import_sources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    domain TEXT NOT NULL UNIQUE,
    site_name TEXT NOT NULL,
    recipe_pattern TEXT,
    extraction_rules JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    success_rate DECIMAL(3,2) DEFAULT 0,
    total_imports INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create import_analytics table
CREATE TABLE IF NOT EXISTS import_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    import_method TEXT NOT NULL,
    source_domain TEXT,
    total_imports INTEGER DEFAULT 0,
    successful_imports INTEGER DEFAULT 0,
    failed_imports INTEGER DEFAULT 0,
    average_confidence DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, import_method, source_domain)
);

-- =====================================================
-- RECIPE ORGANIZATION TABLES
-- =====================================================

-- Create recipe_collections table
CREATE TABLE IF NOT EXISTS recipe_collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT false,
    cover_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipe_collection_items table (many-to-many)
CREATE TABLE IF NOT EXISTS recipe_collection_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id UUID NOT NULL REFERENCES recipe_collections(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(collection_id, recipe_id)
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dietary_restrictions TEXT[],
    cuisine_preferences TEXT[],
    cooking_skill_level TEXT CHECK (cooking_skill_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'intermediate',
    preferred_cooking_time INTEGER, -- in minutes
    household_size INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- =====================================================
-- MEAL PLANNING TABLES
-- =====================================================

-- Create meal_plans table
CREATE TABLE IF NOT EXISTS meal_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal_plan_items table
CREATE TABLE IF NOT EXISTS meal_plan_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
    recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')) NOT NULL,
    planned_date DATE NOT NULL,
    servings INTEGER DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shopping_lists table
CREATE TABLE IF NOT EXISTS shopping_lists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shopping_list_items table
CREATE TABLE IF NOT EXISTS shopping_list_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shopping_list_id UUID NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount DECIMAL(10,2),
    unit TEXT,
    category TEXT,
    is_checked BOOLEAN DEFAULT false,
    priority TEXT CHECK (priority IN ('low', 'normal', 'high', 'urgent')) DEFAULT 'normal',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- RECIPE ADJUSTMENTS TABLES
-- =====================================================

-- Create recipe_adjustments table
CREATE TABLE IF NOT EXISTS recipe_adjustments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    adjustment_type TEXT CHECK (adjustment_type IN ('scaling', 'unit_conversion', 'substitution', 'equipment')) NOT NULL,
    original_servings INTEGER NOT NULL,
    new_servings INTEGER NOT NULL,
    scaling_factor DECIMAL(5,2) NOT NULL,
    adjustment_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unit_conversions table
CREATE TABLE IF NOT EXISTS unit_conversions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    from_unit TEXT NOT NULL,
    to_unit TEXT NOT NULL,
    conversion_factor DECIMAL(10,4) NOT NULL,
    ingredient_category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(from_unit, to_unit, ingredient_category)
);

-- Create ingredient_substitutions table
CREATE TABLE IF NOT EXISTS ingredient_substitutions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    original_ingredient TEXT NOT NULL,
    substitute_ingredient TEXT NOT NULL,
    substitution_ratio TEXT, -- e.g., "1:1", "2:1"
    notes TEXT,
    confidence_score DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TRANSLATION SYSTEM TABLES
-- =====================================================

-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_type TEXT NOT NULL CHECK (content_type IN ('recipe', 'newsletter', 'category', 'tag')),
    content_id TEXT NOT NULL,
    field_name TEXT NOT NULL,
    original_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    source_language TEXT NOT NULL DEFAULT 'en',
    target_language TEXT NOT NULL,
    translation_status TEXT NOT NULL DEFAULT 'pending' CHECK (translation_status IN ('pending', 'completed', 'failed', 'outdated')),
    translation_provider TEXT,
    confidence_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Composite unique constraint to prevent duplicate translations
    UNIQUE(content_type, content_id, field_name, target_language)
);

-- Create translation_jobs table
CREATE TABLE IF NOT EXISTS translation_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_type TEXT NOT NULL CHECK (content_type IN ('recipe', 'newsletter', 'category', 'tag')),
    content_id TEXT NOT NULL,
    target_language TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    
    -- Composite unique constraint to prevent duplicate jobs
    UNIQUE(content_type, content_id, target_language, status)
);

-- Create user_language_preferences table
CREATE TABLE IF NOT EXISTS user_language_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preferred_language TEXT NOT NULL DEFAULT 'en',
    fallback_language TEXT NOT NULL DEFAULT 'en',
    auto_translate BOOLEAN DEFAULT true,
    translation_quality TEXT NOT NULL DEFAULT 'balanced' CHECK (translation_quality IN ('fast', 'balanced', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- One preference per user
    UNIQUE(user_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Core tables indexes
CREATE INDEX IF NOT EXISTS idx_recipes_author ON recipes(author_id);
CREATE INDEX IF NOT EXISTS idx_recipes_status ON recipes(status);
CREATE INDEX IF NOT EXISTS idx_recipes_rating ON recipes(rating);
CREATE INDEX IF NOT EXISTS idx_recipes_created ON recipes(created_at);

CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe ON recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_order ON recipe_ingredients(order_index);

CREATE INDEX IF NOT EXISTS idx_recipe_categories_recipe ON recipe_categories(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_categories_category ON recipe_categories(category_id);

-- Import system indexes
CREATE INDEX IF NOT EXISTS idx_recipe_imports_recipe ON recipe_imports(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_imports_user ON recipe_imports(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_imports_status ON recipe_imports(import_status);

CREATE INDEX IF NOT EXISTS idx_import_sources_domain ON import_sources(domain);
CREATE INDEX IF NOT EXISTS idx_import_sources_active ON import_sources(is_active);

-- Organization indexes
CREATE INDEX IF NOT EXISTS idx_recipe_collections_user ON recipe_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_collections_public ON recipe_collections(is_public);

CREATE INDEX IF NOT EXISTS idx_recipe_collection_items_collection ON recipe_collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_recipe_collection_items_recipe ON recipe_collection_items(recipe_id);

-- Meal planning indexes
CREATE INDEX IF NOT EXISTS idx_meal_plans_user ON meal_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_dates ON meal_plans(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_meal_plan_items_plan ON meal_plan_items(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_meal_plan_items_date ON meal_plan_items(planned_date);

CREATE INDEX IF NOT EXISTS idx_shopping_lists_user ON shopping_lists(user_id);

CREATE INDEX IF NOT EXISTS idx_shopping_list_items_list ON shopping_list_items(shopping_list_id);
CREATE INDEX IF NOT EXISTS idx_shopping_list_items_checked ON shopping_list_items(is_checked);

-- Translation indexes
CREATE INDEX IF NOT EXISTS idx_translations_content ON translations(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_translations_language ON translations(target_language);
CREATE INDEX IF NOT EXISTS idx_translations_status ON translations(translation_status);

CREATE INDEX IF NOT EXISTS idx_translation_jobs_status ON translation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_translation_jobs_priority ON translation_jobs(priority);
CREATE INDEX IF NOT EXISTS idx_translation_jobs_content ON translation_jobs(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_translation_jobs_created ON translation_jobs(created_at);

CREATE INDEX IF NOT EXISTS idx_user_language_preferences_user ON user_language_preferences(user_id);

-- =====================================================
-- TRIGGERS AND FUNCTIONS
-- =====================================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_recipes_updated_at 
    BEFORE UPDATE ON recipes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletters_updated_at 
    BEFORE UPDATE ON newsletters 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_import_sources_updated_at 
    BEFORE UPDATE ON import_sources 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipe_collections_updated_at 
    BEFORE UPDATE ON recipe_collections 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON user_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_plans_updated_at 
    BEFORE UPDATE ON meal_plans 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopping_lists_updated_at 
    BEFORE UPDATE ON shopping_lists 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_translations_updated_at 
    BEFORE UPDATE ON translations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_translation_jobs_updated_at 
    BEFORE UPDATE ON translation_jobs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_language_preferences_updated_at 
    BEFORE UPDATE ON user_language_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a function to automatically queue translations when content is created/updated
CREATE OR REPLACE FUNCTION queue_content_translation()
RETURNS TRIGGER AS $$
DECLARE
    supported_languages TEXT[] := ARRAY['es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ar'];
    lang TEXT;
BEGIN
    -- Queue translation jobs for all supported languages
    FOREACH lang IN ARRAY supported_languages
    LOOP
        INSERT INTO translation_jobs (content_type, content_id, target_language, priority, status)
        VALUES (
            CASE 
                WHEN TG_TABLE_NAME = 'recipes' THEN 'recipe'
                WHEN TG_TABLE_NAME = 'newsletters' THEN 'newsletter'
                ELSE 'recipe'
            END,
            NEW.id::TEXT,
            lang,
            'normal',
            'pending'
        )
        ON CONFLICT (content_type, content_id, target_language, status) DO NOTHING;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically queue translations
CREATE TRIGGER queue_recipe_translation
    AFTER INSERT OR UPDATE ON recipes
    FOR EACH ROW EXECUTE FUNCTION queue_content_translation();

CREATE TRIGGER queue_newsletter_translation
    AFTER INSERT OR UPDATE ON newsletters
    FOR EACH ROW EXECUTE FUNCTION queue_content_translation();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_substitutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_language_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for core tables
CREATE POLICY "Users can view all recipes" ON recipes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own recipes" ON recipes FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own recipes" ON recipes FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own recipes" ON recipes FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Users can view all newsletters" ON newsletters FOR SELECT USING (true);
CREATE POLICY "Users can insert their own newsletters" ON newsletters FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own newsletters" ON newsletters FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own newsletters" ON newsletters FOR DELETE USING (auth.uid() = author_id);

-- Create RLS policies for translation tables
CREATE POLICY "Users can view translations" ON translations FOR SELECT USING (true);
CREATE POLICY "Users can insert translations" ON translations FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update translations" ON translations FOR UPDATE USING (true);

CREATE POLICY "Users can view translation jobs" ON translation_jobs FOR SELECT USING (true);
CREATE POLICY "Users can insert translation jobs" ON translation_jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update translation jobs" ON translation_jobs FOR UPDATE USING (true);

CREATE POLICY "Users can view their own language preferences" ON user_language_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own language preferences" ON user_language_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own language preferences" ON user_language_preferences FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- VIEWS FOR ANALYTICS
-- =====================================================

-- Create a view for translation statistics
CREATE OR REPLACE VIEW translation_stats AS
SELECT 
    content_type,
    target_language,
    COUNT(*) as total_translations,
    COUNT(*) FILTER (WHERE translation_status = 'completed') as completed,
    COUNT(*) FILTER (WHERE translation_status = 'pending') as pending,
    COUNT(*) FILTER (WHERE translation_status = 'failed') as failed,
    COUNT(*) FILTER (WHERE translation_status = 'outdated') as outdated
FROM translations
GROUP BY content_type, target_language;

-- Create a view for job statistics
CREATE OR REPLACE VIEW job_stats AS
SELECT 
    content_type,
    target_language,
    priority,
    COUNT(*) as total_jobs,
    COUNT(*) FILTER (WHERE status = 'pending') as pending,
    COUNT(*) FILTER (WHERE status = 'processing') as processing,
    COUNT(*) FILTER (WHERE status = 'completed') as completed,
    COUNT(*) FILTER (WHERE status = 'failed') as failed,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled
FROM translation_jobs
GROUP BY content_type, target_language, priority;

-- Create a view for recipe statistics
CREATE OR REPLACE VIEW recipe_stats AS
SELECT 
    COUNT(*) as total_recipes,
    COUNT(*) FILTER (WHERE status = 'published') as published_recipes,
    COUNT(*) FILTER (WHERE status = 'draft') as draft_recipes,
    AVG(rating) as average_rating,
    SUM(view_count) as total_views
FROM recipes;

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Insert some default categories
INSERT INTO categories (name, description) VALUES
    ('Breakfast', 'Morning meals and breakfast dishes'),
    ('Lunch', 'Midday meals and lunch options'),
    ('Dinner', 'Evening meals and dinner dishes'),
    ('Dessert', 'Sweet treats and desserts'),
    ('Appetizer', 'Starters and appetizers'),
    ('Soup', 'Soups and stews'),
    ('Salad', 'Fresh salads and greens'),
    ('Bread', 'Breads and baked goods'),
    ('Pasta', 'Pasta dishes and noodles'),
    ('Seafood', 'Fish and seafood dishes'),
    ('Meat', 'Meat-based dishes'),
    ('Vegetarian', 'Vegetarian and plant-based dishes'),
    ('Vegan', 'Vegan dishes'),
    ('Gluten-Free', 'Gluten-free options'),
    ('Quick & Easy', 'Quick and easy recipes'),
    ('Slow Cooker', 'Slow cooker and crockpot recipes')
ON CONFLICT (name) DO NOTHING;

-- Insert some default unit conversions
INSERT INTO unit_conversions (from_unit, to_unit, conversion_factor, ingredient_category) VALUES
    ('cups', 'ml', 236.588, 'liquid'),
    ('tbsp', 'ml', 14.7868, 'liquid'),
    ('tsp', 'ml', 4.92892, 'liquid'),
    ('oz', 'g', 28.3495, 'weight'),
    ('lbs', 'g', 453.592, 'weight'),
    ('cups', 'g', 128, 'flour'),
    ('tbsp', 'g', 8, 'flour'),
    ('tsp', 'g', 2.67, 'flour')
ON CONFLICT (from_unit, to_unit, ingredient_category) DO NOTHING;

-- Insert some common ingredient substitutions
INSERT INTO ingredient_substitutions (original_ingredient, substitute_ingredient, substitution_ratio, notes, confidence_score) VALUES
    ('butter', 'olive oil', '1:1', 'For cooking, not baking', 0.8),
    ('eggs', 'flax seeds', '1:3 tbsp ground flax + 3 tbsp water', 'Vegan substitute', 0.7),
    ('milk', 'almond milk', '1:1', 'Dairy-free alternative', 0.9),
    ('sugar', 'honey', '1:0.75', 'Reduce other liquids', 0.8),
    ('all-purpose flour', 'whole wheat flour', '1:1', 'May need more liquid', 0.7)
ON CONFLICT (original_ingredient, substitute_ingredient) DO NOTHING;

-- Insert some default import sources
INSERT INTO import_sources (domain, site_name, recipe_pattern, extraction_rules, is_active) VALUES
    ('allrecipes.com', 'AllRecipes', 'https://www.allrecipes.com/recipe/*', 
     '{"title": "h1", "ingredients": ".ingredients-item-name", "instructions": ".paragraph p", "description": ".recipe-summary"}', 
     true),
    ('foodnetwork.com', 'Food Network', 'https://www.foodnetwork.com/recipes/*', 
     '{"title": "h1", "ingredients": ".o-Ingredients__a-Ingredient", "instructions": ".o-Method__m-Step", "description": ".o-AssetDescription__a-Description"}', 
     true),
    ('epicurious.com', 'Epicurious', 'https://www.epicurious.com/recipes/*', 
     '{"title": "h1", "ingredients": ".ingredient", "instructions": ".preparation-step", "description": ".dek"}', 
     true)
ON CONFLICT (domain) DO NOTHING;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant necessary permissions (adjust based on your Supabase setup)
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- This migration creates all necessary tables for the complete Cooking With! platform
-- including core functionality, recipe importing, organization, meal planning, 
-- adjustments, and the translation system.

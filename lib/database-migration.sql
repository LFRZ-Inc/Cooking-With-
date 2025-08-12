-- Translation Management Database Migration
-- This script creates the necessary tables for the translation system

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_translations_content ON translations(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_translations_language ON translations(target_language);
CREATE INDEX IF NOT EXISTS idx_translations_status ON translations(translation_status);

CREATE INDEX IF NOT EXISTS idx_translation_jobs_status ON translation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_translation_jobs_priority ON translation_jobs(priority);
CREATE INDEX IF NOT EXISTS idx_translation_jobs_content ON translation_jobs(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_translation_jobs_created ON translation_jobs(created_at);

CREATE INDEX IF NOT EXISTS idx_user_language_preferences_user ON user_language_preferences(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_translations_updated_at 
    BEFORE UPDATE ON translations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_translation_jobs_updated_at 
    BEFORE UPDATE ON translation_jobs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_language_preferences_updated_at 
    BEFORE UPDATE ON user_language_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some initial data for testing (optional)
-- INSERT INTO user_language_preferences (user_id, preferred_language, fallback_language, auto_translate, translation_quality)
-- VALUES 
--     ('your-user-id-here', 'en', 'en', true, 'balanced'),
--     ('another-user-id-here', 'es', 'en', true, 'high');

-- Grant necessary permissions (adjust based on your Supabase setup)
-- GRANT ALL ON translations TO authenticated;
-- GRANT ALL ON translation_jobs TO authenticated;
-- GRANT ALL ON user_language_preferences TO authenticated;

-- Enable Row Level Security (RLS)
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_language_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for translations table
CREATE POLICY "Users can view translations" ON translations
    FOR SELECT USING (true);

CREATE POLICY "Users can insert translations" ON translations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update translations" ON translations
    FOR UPDATE USING (true);

-- Create RLS policies for translation_jobs table
CREATE POLICY "Users can view translation jobs" ON translation_jobs
    FOR SELECT USING (true);

CREATE POLICY "Users can insert translation jobs" ON translation_jobs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update translation jobs" ON translation_jobs
    FOR UPDATE USING (true);

-- Create RLS policies for user_language_preferences table
CREATE POLICY "Users can view their own language preferences" ON user_language_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own language preferences" ON user_language_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own language preferences" ON user_language_preferences
    FOR UPDATE USING (auth.uid() = user_id);

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
-- Recipe Importing System Database Schema
-- This extends the existing database with import-specific tables

-- Recipe imports tracking
CREATE TABLE IF NOT EXISTS recipe_imports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_url TEXT,
    source_domain TEXT,
    import_method TEXT NOT NULL CHECK (import_method IN ('webpage', 'image', 'text', 'manual')),
    original_content TEXT,
    import_metadata JSONB,
    import_status TEXT NOT NULL DEFAULT 'processing' CHECK (import_status IN ('processing', 'completed', 'failed', 'reviewed')),
    confidence_score DECIMAL(3,2),
    field_mapping JSONB, -- Stores how fields were mapped during import
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for performance
    CONSTRAINT idx_recipe_imports_recipe_id UNIQUE(recipe_id),
    CONSTRAINT idx_recipe_imports_user_id UNIQUE(user_id, recipe_id)
);

-- Import sources for analytics and tracking
CREATE TABLE IF NOT EXISTS import_sources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    domain TEXT NOT NULL,
    site_name TEXT,
    recipe_pattern TEXT, -- URL pattern for recipe pages
    extraction_rules JSONB, -- Custom extraction rules for this site
    success_rate DECIMAL(3,2) DEFAULT 0,
    total_imports INTEGER DEFAULT 0,
    last_import_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(domain)
);

-- Import templates for different sites
CREATE TABLE IF NOT EXISTS import_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source_domain TEXT NOT NULL,
    template_name TEXT NOT NULL,
    field_selectors JSONB NOT NULL, -- CSS selectors for different fields
    validation_rules JSONB, -- Rules to validate extracted content
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(source_domain, template_name)
);

-- Import queue for background processing
CREATE TABLE IF NOT EXISTS import_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    import_type TEXT NOT NULL CHECK (import_type IN ('webpage', 'image', 'text')),
    source_data TEXT NOT NULL, -- URL, image data, or text content
    priority INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    processing_started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Import analytics
CREATE TABLE IF NOT EXISTS import_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    import_method TEXT NOT NULL,
    source_domain TEXT,
    total_imports INTEGER DEFAULT 0,
    successful_imports INTEGER DEFAULT 0,
    failed_imports INTEGER DEFAULT 0,
    average_confidence DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(date, import_method, source_domain)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_recipe_imports_user_id ON recipe_imports(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_imports_status ON recipe_imports(import_status);
CREATE INDEX IF NOT EXISTS idx_recipe_imports_source_domain ON recipe_imports(source_domain);
CREATE INDEX IF NOT EXISTS idx_recipe_imports_created_at ON recipe_imports(created_at);

CREATE INDEX IF NOT EXISTS idx_import_queue_status ON import_queue(status);
CREATE INDEX IF NOT EXISTS idx_import_queue_user_id ON import_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_import_queue_priority ON import_queue(priority, created_at);

CREATE INDEX IF NOT EXISTS idx_import_sources_domain ON import_sources(domain);
CREATE INDEX IF NOT EXISTS idx_import_templates_domain ON import_templates(source_domain);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_recipe_imports_updated_at 
    BEFORE UPDATE ON recipe_imports 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_import_sources_updated_at 
    BEFORE UPDATE ON import_sources 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_import_templates_updated_at 
    BEFORE UPDATE ON import_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_import_queue_updated_at 
    BEFORE UPDATE ON import_queue 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE recipe_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for recipe_imports
CREATE POLICY "Users can view their own recipe imports" ON recipe_imports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recipe imports" ON recipe_imports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipe imports" ON recipe_imports
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for import_queue
CREATE POLICY "Users can view their own import queue" ON import_queue
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own import queue items" ON import_queue
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own import queue items" ON import_queue
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for import_sources (read-only for all users)
CREATE POLICY "Users can view import sources" ON import_sources
    FOR SELECT USING (true);

-- Create RLS policies for import_templates (read-only for all users)
CREATE POLICY "Users can view import templates" ON import_templates
    FOR SELECT USING (true);

-- Create RLS policies for import_analytics (admin only)
CREATE POLICY "Admins can view import analytics" ON import_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Insert some initial import sources for popular recipe sites
INSERT INTO import_sources (domain, site_name, recipe_pattern, extraction_rules) VALUES
('allrecipes.com', 'AllRecipes', '/recipe/', '{"title": ".recipe-title", "ingredients": ".ingredients-item", "instructions": ".instructions-section"}'),
('foodnetwork.com', 'Food Network', '/recipes/', '{"title": ".recipe-title", "ingredients": ".ingredients-list", "instructions": ".instructions-list"}'),
('epicurious.com', 'Epicurious', '/recipes/', '{"title": ".recipe-title", "ingredients": ".ingredients", "instructions": ".instructions"}'),
('bonappetit.com', 'Bon Appétit', '/recipe/', '{"title": ".recipe-title", "ingredients": ".ingredients", "instructions": ".instructions"}'),
('seriouseats.com', 'Serious Eats', '/recipes/', '{"title": ".recipe-title", "ingredients": ".ingredients", "instructions": ".instructions"}')
ON CONFLICT (domain) DO NOTHING;

-- Create a view for import statistics
CREATE OR REPLACE VIEW import_stats AS
SELECT 
    DATE_TRUNC('day', created_at) as import_date,
    import_method,
    COUNT(*) as total_imports,
    COUNT(*) FILTER (WHERE import_status = 'completed') as successful_imports,
    COUNT(*) FILTER (WHERE import_status = 'failed') as failed_imports,
    AVG(confidence_score) as avg_confidence
FROM recipe_imports
GROUP BY DATE_TRUNC('day', created_at), import_method
ORDER BY import_date DESC; 
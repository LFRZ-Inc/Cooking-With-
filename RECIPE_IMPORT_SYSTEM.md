# Recipe Importing System

## Overview

The Recipe Importing System is a powerful feature that allows users to import recipes from various sources including websites, images, and text. This system integrates seamlessly with the existing translation system to automatically translate imported recipes to the user's preferred language.

## Features

### 🎯 **Core Import Methods**

1. **Website Import**
   - Paste recipe URLs from popular cooking sites
   - Automatic content extraction using site-specific templates
   - Support for AllRecipes, Food Network, Epicurious, and more
   - Fallback generic parsing for unsupported sites

2. **Image Import (OCR)**
   - Upload recipe photos or screenshots
   - Optical Character Recognition (OCR) text extraction
   - Support for handwritten notes and printed recipes
   - Automatic text parsing and recipe structure detection

3. **Text Import**
   - Direct text pasting from any source
   - Smart parsing of ingredients and instructions
   - Automatic metadata extraction (cooking times, servings, etc.)
   - Support for various text formats and structures

### 🔧 **Advanced Features**

- **Smart Parsing**: AI-powered content extraction and field mapping
- **Confidence Scoring**: Quality assessment of parsed content
- **Edit & Review**: Full editing capabilities before saving
- **Auto Translation**: Seamless integration with translation system
- **Import Analytics**: Track success rates and improve parsing
- **Source Templates**: Custom extraction rules for different websites

## Database Schema

### Core Tables

#### `recipe_imports`
Tracks all recipe imports with metadata and status.

```sql
CREATE TABLE recipe_imports (
    id UUID PRIMARY KEY,
    recipe_id UUID REFERENCES recipes(id),
    user_id UUID REFERENCES users(id),
    source_url TEXT,
    source_domain TEXT,
    import_method TEXT CHECK (import_method IN ('webpage', 'image', 'text', 'manual')),
    original_content TEXT,
    import_metadata JSONB,
    import_status TEXT DEFAULT 'processing',
    confidence_score DECIMAL(3,2),
    field_mapping JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `import_sources`
Manages supported websites and their extraction rules.

```sql
CREATE TABLE import_sources (
    id UUID PRIMARY KEY,
    domain TEXT UNIQUE,
    site_name TEXT,
    recipe_pattern TEXT,
    extraction_rules JSONB,
    success_rate DECIMAL(3,2),
    total_imports INTEGER,
    last_import_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `import_templates`
Custom extraction templates for different websites.

```sql
CREATE TABLE import_templates (
    id UUID PRIMARY KEY,
    source_domain TEXT,
    template_name TEXT,
    field_selectors JSONB,
    validation_rules JSONB,
    priority INTEGER,
    is_active BOOLEAN,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `import_queue`
Background processing queue for imports.

```sql
CREATE TABLE import_queue (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    import_type TEXT CHECK (import_type IN ('webpage', 'image', 'text')),
    source_data TEXT,
    priority INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    processing_started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `import_analytics`
Analytics and success rate tracking.

```sql
CREATE TABLE import_analytics (
    id UUID PRIMARY KEY,
    date DATE,
    import_method TEXT,
    source_domain TEXT,
    total_imports INTEGER,
    successful_imports INTEGER,
    failed_imports INTEGER,
    average_confidence DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### POST `/api/recipes/import`

Main endpoint for recipe importing.

**Request Body:**
```json
{
  "import_type": "webpage|image|text",
  "source_data": "URL, image data, or text content",
  "user_id": "uuid",
  "auto_translate": false,
  "target_language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "recipe": {
    "id": "uuid",
    "title": "Recipe Title",
    "ingredients": ["ingredient1", "ingredient2"],
    "instructions": ["step1", "step2"],
    "import_info": {
      "method": "webpage",
      "confidence": 0.85,
      "source_url": "https://example.com/recipe"
    }
  }
}
```

## Components

### RecipeImportWizard

A comprehensive modal wizard that guides users through the import process.

**Features:**
- Multi-step import process
- Real-time parsing feedback
- Edit and review capabilities
- Progress tracking
- Error handling

**Usage:**
```tsx
<RecipeImportWizard
  onImportComplete={(recipe) => {
    // Handle successful import
  }}
  onClose={() => {
    // Handle modal close
  }}
/>
```

### RecipeImportPage

Dedicated page for recipe importing with feature overview and tips.

**Features:**
- Import method explanations
- Success stories and tips
- Direct access to import wizard
- User authentication check

## Services

### RecipeParser

Singleton service for parsing recipes from various sources.

**Key Methods:**
- `parseFromWebpage(url)`: Parse recipe from website URL
- `parseFromImage(imageData)`: Parse recipe from image using OCR
- `parseFromText(text)`: Parse recipe from text content
- `loadImportSources()`: Load supported websites from database

**Usage:**
```typescript
import { recipeParser } from '@/lib/recipeParser'

const parsedRecipe = await recipeParser.parseFromWebpage('https://example.com/recipe')
```

## Integration with Translation System

The recipe importing system seamlessly integrates with the existing translation infrastructure:

1. **Automatic Translation**: Imported recipes are automatically translated to the user's preferred language
2. **Translation Jobs**: Import triggers translation job creation for background processing
3. **Translation Status**: Imported recipes show translation status in the UI
4. **Multi-language Support**: Support for importing recipes in any language

## User Experience

### Import Flow

1. **Choose Method**: User selects import method (website, image, or text)
2. **Provide Source**: User provides the recipe source (URL, image, or text)
3. **Review & Edit**: User reviews parsed content and makes adjustments
4. **Save Recipe**: Recipe is saved with import metadata and translation queued

### Error Handling

- **Parsing Failures**: Graceful fallback to manual editing
- **Network Issues**: Retry mechanisms for failed imports
- **Invalid Content**: Clear error messages and suggestions
- **Confidence Scoring**: Visual indicators of parsing quality

## Admin Features

### Import Analytics Dashboard

Admins can monitor import performance:

- Success rates by source and method
- Popular import sources
- Failed import patterns
- User engagement metrics

### Template Management

Admins can manage extraction templates:

- Add new website templates
- Update existing extraction rules
- Test template effectiveness
- Monitor template performance

## Configuration

### Environment Variables

```env
# Optional: Google Vision API for OCR
GOOGLE_VISION_API_KEY=your_api_key

# Optional: Web scraping service
SCRAPING_SERVICE_URL=your_scraping_service_url
```

### Supported Websites

The system includes pre-configured templates for:

- AllRecipes.com
- FoodNetwork.com
- Epicurious.com
- BonAppetit.com
- SeriousEats.com

### Custom Templates

Admins can add custom templates for new websites:

```json
{
  "title": ".recipe-title",
  "ingredients": ".ingredients-item",
  "instructions": ".instructions-section",
  "description": ".recipe-description",
  "prep_time": ".prep-time",
  "cook_time": ".cook-time",
  "servings": ".servings",
  "image": ".recipe-image"
}
```

## Performance Considerations

### Caching

- Parsed content is cached to avoid re-parsing
- Import templates are cached in memory
- Translation results are cached in database

### Rate Limiting

- Import requests are rate-limited per user
- Background processing prevents UI blocking
- Queue management for high-volume imports

### Optimization

- Lazy loading of import wizard
- Efficient image processing
- Optimized database queries
- CDN for static assets

## Security

### Data Protection

- User data isolation with RLS policies
- Secure file upload handling
- Input validation and sanitization
- Rate limiting to prevent abuse

### Privacy

- Import metadata is user-specific
- No tracking of personal recipe content
- Secure deletion of temporary files
- GDPR-compliant data handling

## Future Enhancements

### Planned Features

1. **Advanced OCR**: Better handwriting recognition
2. **Recipe Validation**: AI-powered recipe verification
3. **Bulk Import**: Import multiple recipes at once
4. **Recipe Enhancement**: AI suggestions for recipe improvement
5. **Social Import**: Import from social media platforms
6. **Voice Import**: Voice-to-text recipe import

### Technical Improvements

1. **Machine Learning**: Improved parsing accuracy
2. **Real-time Processing**: Instant import feedback
3. **Offline Support**: Import without internet connection
4. **Mobile Optimization**: Enhanced mobile import experience

## Troubleshooting

### Common Issues

1. **Import Fails**: Check source URL validity and network connection
2. **Poor Parsing**: Verify recipe format and try manual editing
3. **Translation Issues**: Check translation service status
4. **Performance**: Monitor queue status and system resources

### Debug Tools

- Import logs in admin dashboard
- Confidence score indicators
- Parsing preview mode
- Error reporting system

## Conclusion

The Recipe Importing System provides a comprehensive solution for users to easily import recipes from any source while maintaining high quality and accuracy. The integration with the translation system ensures that imported recipes are immediately available in the user's preferred language, making the platform truly global and accessible.

The system is designed to be scalable, maintainable, and user-friendly, with extensive admin controls and analytics to ensure optimal performance and user satisfaction. 
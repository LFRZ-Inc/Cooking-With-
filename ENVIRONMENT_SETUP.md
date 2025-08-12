# Environment Setup Guide

## Translation System Configuration

### Required Environment Variables

Add these to your `.env.local` file:

```bash
# LibreTranslate Configuration (Primary translation service)
LIBRETRANSLATE_URL=https://libretranslate.com
LIBRETRANSLATE_API_KEY=your_api_key_here

# Optional: Self-hosted LibreTranslate
# LIBRETRANSLATE_URL=http://localhost:5000
# LIBRETRANSLATE_API_KEY=your_self_hosted_key

# Site URL for server-side API calls
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase Configuration (should already be set)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Translation Service Options

1. **LibreTranslate (Recommended)**
   - Free tier available
   - Privacy-focused
   - No data sent to Google
   - Sign up at: https://libretranslate.com

2. **Self-hosted LibreTranslate**
   - Complete privacy
   - Docker installation available
   - No API limits

3. **Fallback Service**
   - MyMemory API (no key required)
   - Automatically used if LibreTranslate fails
   - Limited but functional

## Database Setup

### Run Migration Script

Execute the database migration in your Supabase SQL editor:

```sql
-- Copy and paste the contents of lib/database-migration.sql
-- This creates all necessary tables for the translation system
```

### Required Tables

- `translations` - Stores completed translations
- `translation_jobs` - Manages translation queue
- `user_language_preferences` - User language settings
- `import_sources` - Website parsing templates

## Testing the System

### 1. Test Translation API

```bash
# Start the development server
npm run dev

# In another terminal, run the test script
node test-translation.js
```

### 2. Test Recipe Import

1. Navigate to `/recipes/import`
2. Try importing a recipe using text input
3. Verify the parsing works correctly
4. Check that translation is triggered (if enabled)

### 3. Test Language Switching

1. Use the language switcher in the navbar
2. Verify translations load correctly
3. Check that content updates appropriately

## Troubleshooting

### Translation Not Working

1. **Check environment variables**
   ```bash
   echo $LIBRETRANSLATE_URL
   echo $LIBRETRANSLATE_API_KEY
   ```

2. **Test LibreTranslate directly**
   ```bash
   curl -X POST "https://libretranslate.com/translate" \
     -H "Content-Type: application/json" \
     -d '{"q":"Hello","source":"en","target":"es"}'
   ```

3. **Check browser console for errors**
   - Look for API call failures
   - Check network tab for failed requests

### Recipe Import Not Working

1. **Check database connection**
   - Verify Supabase credentials
   - Check if tables exist

2. **Test parsing logic**
   - Try different import types
   - Check console for parsing errors

3. **Verify file uploads**
   - Check if image uploads work
   - Verify OCR processing

### Common Issues

1. **CORS Errors**
   - Ensure `NEXT_PUBLIC_SITE_URL` is set correctly
   - Check that API routes are accessible

2. **Database Permission Errors**
   - Verify RLS policies are set up
   - Check service role key permissions

3. **Translation Service Unavailable**
   - System will fallback to MyMemory API
   - Original text will be shown with warning

## Performance Optimization

### Translation Caching

- Translations are cached in database
- Client-side caching for frequently used translations
- Batch processing for multiple translations

### Import Optimization

- HTML parsing optimized with node-html-parser
- OCR processing with Tesseract.js
- Async processing for large imports

## Security Considerations

1. **API Key Management**
   - Store keys in environment variables
   - Never commit keys to version control
   - Use different keys for development/production

2. **Data Privacy**
   - No data sent to Google services
   - LibreTranslate is privacy-focused
   - User data stays within your control

3. **Rate Limiting**
   - Implement rate limiting for API calls
   - Monitor translation service usage
   - Set appropriate limits for free tiers

## Monitoring

### Translation Metrics

- Success/failure rates
- Processing times
- Queue status
- Error tracking

### Import Analytics

- Success rates by import type
- Parsing confidence scores
- User feedback integration
- Performance monitoring

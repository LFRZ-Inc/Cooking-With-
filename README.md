# Cooking With! 🍳

A comprehensive culinary platform that goes beyond recipe sharing - it's your complete kitchen companion with advanced features inspired by ReciMe and more!

## 🚀 Features

### ✅ **Recipe Importing System** (Phase 1)
- **AI Food Recognition**: Take photos of cooked food to generate recipes (like ReciMe!)
- **Multi-Source Import**: Import recipes from webpages, images, or text
- **AI-Powered Parsing**: Smart field detection and extraction
- **Confidence Scoring**: Quality assessment of imported content
- **Review System**: Edit and refine imported recipes before saving
- **Translation Integration**: Automatic translation of imported content

### ✅ **Advanced Recipe Organization** (Phase 2)
- **Recipe Collections**: Create custom collections with privacy settings
- **Enhanced Categories & Tags**: Hierarchical organization system
- **Meal Types & Cuisines**: International cuisine classification
- **Dietary Restrictions**: Allergen and diet tracking
- **Advanced Search**: Multi-dimensional filtering capabilities
- **AI Recommendations**: Smart recipe suggestions based on preferences
- **Analytics Dashboard**: User insights and cooking statistics

### ✅ **Meal Planning & Shopping Lists** (Phase 3)
- **Weekly/Monthly Planning**: Calendar-based meal planning
- **Smart Shopping Lists**: Auto-generate from selected recipes
- **Cost Tracking**: Budget management and expense tracking
- **Category Organization**: Store-optimized shopping lists
- **Priority System**: High/urgent priority items
- **Check-off Lists**: Interactive shopping list management

### ✅ **Recipe Adjustments & Conversions** (Phase 4)
- **Dynamic Scaling**: Scale ingredients and times proportionally
- **Unit Conversions**: Convert between metric/imperial units
- **Ingredient Substitutions**: Community-driven substitution database
- **Equipment Adjustments**: Cooking time modifications based on equipment
- **Scaling History**: Track all scaling operations
- **Pro Tips**: Expert advice for best practices

### 🌟 **Premium Features** (Beyond ReciMe)
- **Translation System**: Multi-language support with automatic translation
- **Community Features**: Recipe sharing and collaboration
- **Mobile-First Design**: Responsive and accessible interface
- **SEO Optimized**: Search engine friendly
- **Real-time Updates**: Live collaboration and updates

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Headless UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Rich Text**: React Quill

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cooking-with.git
   cd cooking-with
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   GOOGLE_TRANSLATE_API_KEY=your_google_translate_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

The application uses Supabase with the following key tables:

### Core Tables
- `users` - User accounts and profiles
- `recipes` - Recipe content and metadata
- `recipe_ingredients` - Recipe ingredients
- `categories` - Recipe categories
- `newsletters` - Newsletter content

### Import System Tables
- `recipe_imports` - Import history and metadata
- `import_sources` - Source tracking and analytics
- `import_templates` - Import templates for different sources
- `import_queue` - Background import processing
- `import_analytics` - Import performance metrics

### Organization Tables
- `recipe_collections` - User-created recipe collections
- `recipe_collection_items` - Items in collections
- `recipe_categories` - Enhanced category system
- `recipe_tags` - Tagging system
- `recipe_meal_types` - Meal type classification
- `recipe_cuisine_types` - Cuisine type classification
- `recipe_dietary_restrictions` - Dietary restriction tracking

### Meal Planning Tables
- `meal_plans` - User meal plans
- `meal_plan_items` - Items in meal plans
- `shopping_lists` - Shopping lists
- `shopping_list_items` - Items in shopping lists

### Adjustment Tables
- `measurement_units` - Unit definitions
- `unit_conversions` - Conversion rules
- `recipe_scaling_history` - Scaling history
- `ingredient_substitutions` - Substitution database
- `cooking_equipment` - Equipment definitions
- `cooking_time_adjustments` - Time adjustment history

### Translation Tables
- `translations` - Translation cache
- `translation_jobs` - Background translation processing
- `user_language_preferences` - User language settings

## 🚀 Key Features in Detail

### Recipe Importing
```typescript
// AI Food Recognition - generate recipe from food photo
// Option 1: OpenAI (requires API key)
const recipe = await foodRecognitionService.analyzeFoodImage({
  image_url: foodPhotoUrl,
  user_preferences: { dietary_restrictions: ['vegetarian'] }
})

// Option 2: Ethos AI (local, cost-free)
const recipe = await ethosFoodRecognitionService.analyzeFoodImage({
  imageUrl: foodPhotoUrl,
  userPreferences: { dietaryRestrictions: ['vegetarian'] }
})

// Import from webpage
const recipe = await recipeParser.parseFromWebpage(url)

// Import from image (OCR)
const recipe = await recipeParser.parseFromImage(imageFile)

// Import from text
const recipe = await recipeParser.parseFromText(textContent)
```

### Recipe Organization
```typescript
// Create collection
const collection = await recipeOrganizationService.createCollection({
  name: "Family Favorites",
  description: "Our go-to recipes",
  is_public: false
})

// Add recipe to collection
await recipeOrganizationService.addRecipeToCollection(collectionId, recipeId)
```

### Meal Planning
```typescript
// Create meal plan
const mealPlan = await mealPlanningService.createMealPlan({
  name: "Week 1",
  start_date: "2024-01-01",
  end_date: "2024-01-07"
})

// Generate shopping list from meal plan
const shoppingList = await mealPlanningService.generateShoppingListFromMealPlan(mealPlanId)
```

### Recipe Adjustments
```typescript
// Scale recipe
const scaledRecipe = await recipeAdjustmentService.scaleRecipe(recipeId, 8, userId)

// Convert units
const converted = await recipeAdjustmentService.convertUnit(2, "cups", "ml")

// Get substitutions
const substitutions = await recipeAdjustmentService.getSubstitutions("butter")
```

## 🤖 AI Food Recognition Options

The platform supports two AI food recognition systems:

### OpenAI Integration (Default)
- **High Accuracy**: Uses GPT-4 Vision for precise food analysis
- **Easy Setup**: Just add your OpenAI API key
- **Cost**: Pay per API call (tokens used)

### Ethos AI Integration (Cost-Free)
- **Local Processing**: Runs on your own server
- **Privacy-Focused**: No data sent to external APIs
- **Cost-Free**: No API charges or rate limits
- **Customizable**: Modify prompts and models as needed

#### Setting up Ethos AI:
```bash
# Run the setup script
node "Ethos Food AI Version/setup-ethos-ai.js"

# Or manually:
git clone https://github.com/LFRZ-Inc/Ethos-AI.git
cd Ethos-AI
pip install -r requirements.txt
ollama pull llava:7b
ollama pull llama3.2:3b
python backend/main.py
```

For detailed setup instructions, see: `Ethos Food AI Version/README.md`

## 🎯 Competitive Advantages

Your "Cooking With!" platform now offers **significantly more advanced features** than ReciMe:

1. **Comprehensive Import System** - Beyond basic URL importing
2. **Advanced Organization** - Collections, tags, categories, recommendations
3. **Smart Meal Planning** - Auto-generated shopping lists, cost tracking
4. **Dynamic Recipe Adjustments** - Scaling, conversions, substitutions
5. **Translation System** - Multi-language support
6. **Flexible AI Options** - Choose between OpenAI and cost-free Ethos AI
6. **Analytics Dashboard** - User insights and statistics
7. **Community Features** - Recipe sharing and collaboration

## 📱 Pages & Routes

### Core Pages
- `/` - Homepage with featured recipes
- `/recipes` - Recipe listing with search and filters
- `/recipes/[id]` - Individual recipe view
- `/create/recipe` - Recipe creation form

### Import System
- `/recipes/import` - Recipe import wizard
- `/recipes/import/[id]` - Import review and editing

### Organization
- `/recipes/organize` - Recipe organization dashboard
- `/collections/[id]` - Collection view

### Meal Planning
- `/meal-plans` - Meal planning interface
- `/shopping-lists` - Shopping list management

### Recipe Adjustments
- `/recipes/adjust` - Recipe adjustment tools
- `/converter` - Unit conversion calculator

### Admin
- `/admin` - Admin dashboard
- `/admin/translations` - Translation management

## 🔧 Development

### Project Structure
```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── recipes/           # Recipe-related pages
│   ├── admin/             # Admin pages
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utility functions and services
├── public/                # Static assets
└── types/                 # TypeScript type definitions
```

### Key Services
- `recipeParser.ts` - Recipe parsing and import logic
- `recipeOrganizationService.ts` - Organization and search
- `mealPlanningService.ts` - Meal planning and shopping lists
- `recipeAdjustmentService.ts` - Scaling and conversions
- `translationService.ts` - Translation management

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by ReciMe's innovative features
- Built with Next.js and Supabase
- Icons from Lucide React
- UI components from Headless UI

---

**Ready to revolutionize your cooking experience? Start exploring the advanced features of Cooking With! today!** 🎉 
// AI Food Recognition Service for Cooking With! Platform
// Analyzes photos of cooked food and generates recipes

export interface FoodRecognitionResult {
  dish_name: string
  confidence: number
  ingredients: IngredientRecognition[]
  cooking_methods: string[]
  estimated_prep_time: number
  estimated_cook_time: number
  difficulty: 'easy' | 'medium' | 'hard'
  cuisine_type?: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack'
  description: string
  tips: string[]
  visual_analysis: {
    colors: string[]
    textures: string[]
    presentation: string
    garnishes: string[]
  }
}

export interface IngredientRecognition {
  name: string
  confidence: number
  estimated_amount: string
  visual_indicators: string[]
  alternatives: string[]
}

export interface RecipeGenerationRequest {
  image_url: string
  user_preferences?: {
    dietary_restrictions: string[]
    cuisine_preference?: string
    skill_level?: 'beginner' | 'intermediate' | 'advanced'
    time_constraint?: number // minutes
  }
}

export class FoodRecognitionService {
  private static instance: FoodRecognitionService
  private openaiApiKey: string

  private constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || ''
  }

  public static getInstance(): FoodRecognitionService {
    if (!FoodRecognitionService.instance) {
      FoodRecognitionService.instance = new FoodRecognitionService()
    }
    return FoodRecognitionService.instance
  }

  /**
   * Analyze a food image and generate a recipe
   */
  public async analyzeFoodImage(request: RecipeGenerationRequest): Promise<FoodRecognitionResult> {
    try {
      // Use OpenAI's GPT-4 Vision for food analysis
      const analysis = await this.analyzeImageWithAI(request.image_url)
      
      // Generate recipe based on analysis
      const recipe = await this.generateRecipeFromAnalysis(analysis, request.user_preferences)
      
      return recipe
    } catch (error) {
      console.error('Food recognition error:', error)
      throw new Error('Failed to analyze food image')
    }
  }

  /**
   * Use OpenAI GPT-4 Vision to analyze the food image
   */
  private async analyzeImageWithAI(imageUrl: string): Promise<any> {
    const prompt = `
    Analyze this food image and provide detailed information about the dish. Please identify:

    1. **Dish Name**: What is this dish called?
    2. **Main Ingredients**: What are the primary ingredients visible?
    3. **Cooking Methods**: How was this likely cooked (baked, fried, grilled, etc.)?
    4. **Visual Characteristics**:
       - Colors present in the dish
       - Textures visible (crispy, soft, creamy, etc.)
       - Presentation style
       - Any garnishes or toppings
    5. **Cuisine Type**: What type of cuisine does this belong to?
    6. **Meal Type**: Is this breakfast, lunch, dinner, dessert, or snack?
    7. **Difficulty Level**: How complex would this be to make (easy/medium/hard)?
    8. **Time Estimates**: Rough prep and cook time estimates
    9. **Key Techniques**: What cooking techniques are likely involved?

    Please provide this information in a structured format that can be used to generate a recipe.
    `

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      throw new Error('Failed to analyze image with AI')
    }

    const data = await response.json()
    return data.choices[0].message.content
  }

  /**
   * Generate a complete recipe from AI analysis
   */
  private async generateRecipeFromAnalysis(analysis: string, userPreferences?: any): Promise<FoodRecognitionResult> {
    const prompt = `
    Based on this food analysis:
    ${analysis}

    Generate a complete recipe with the following structure:
    
    1. **Recipe Name**: Creative, descriptive name
    2. **Ingredients List**: Complete list with amounts and units
    3. **Step-by-step Instructions**: Detailed cooking steps
    4. **Cooking Times**: Prep time and cook time
    5. **Difficulty Level**: Easy/Medium/Hard
    6. **Serving Size**: Number of servings
    7. **Cooking Tips**: Helpful tips for success
    8. **Variations**: Possible ingredient substitutions or variations

    User Preferences: ${userPreferences ? JSON.stringify(userPreferences) : 'None specified'}

    Please format this as a structured recipe that someone could follow to recreate this dish.
    `

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500
      })
    })

    if (!response.ok) {
      throw new Error('Failed to generate recipe')
    }

    const data = await response.json()
    const recipeText = data.choices[0].message.content

    // Parse the generated recipe into structured format
    return this.parseGeneratedRecipe(recipeText, analysis)
  }

  /**
   * Parse the AI-generated recipe text into structured format
   */
  private parseGeneratedRecipe(recipeText: string, analysis: string): FoodRecognitionResult {
    // Extract dish name (usually the first line or after "Recipe Name:")
    const dishNameMatch = recipeText.match(/(?:Recipe Name:|^)([^\n]+)/i)
    const dish_name = dishNameMatch ? dishNameMatch[1].trim() : 'Generated Recipe'

    // Extract ingredients (look for ingredients section)
    const ingredientsMatch = recipeText.match(/ingredients?:(.*?)(?=instructions?|directions?|steps?|$)/i)
    const ingredientsText = ingredientsMatch ? ingredientsMatch[1] : ''
    const ingredients = this.parseIngredients(ingredientsText)

    // Extract instructions (look for instructions section)
    const instructionsMatch = recipeText.match(/instructions?|directions?|steps?:(.*?)(?=tips?|variations?|servings?|$)/i)
    const instructionsText = instructionsMatch ? instructionsMatch[1] : ''
    const cooking_methods = this.parseInstructions(instructionsText)

    // Extract times
    const timeMatch = recipeText.match(/(?:prep|cook|total)\s*time[:\s]*(\d+)\s*(?:minutes?|mins?)/gi)
    const estimated_prep_time = timeMatch ? parseInt(timeMatch[0].match(/\d+/)?.[0] || '15') : 15
    const estimated_cook_time = timeMatch && timeMatch.length > 1 ? parseInt(timeMatch[1].match(/\d+/)?.[0] || '30') : 30

    // Extract difficulty
    const difficultyMatch = recipeText.match(/difficulty[:\s]*(easy|medium|hard)/i)
    const difficulty = (difficultyMatch?.[1] as 'easy' | 'medium' | 'hard') || 'medium'

    // Extract meal type from analysis
    const mealTypeMatch = analysis.match(/meal\s*type[:\s]*(breakfast|lunch|dinner|dessert|snack)/i)
    const meal_type = (mealTypeMatch?.[1] as any) || 'dinner'

    // Extract cuisine type
    const cuisineMatch = analysis.match(/cuisine[:\s]*([^\n,]+)/i)
    const cuisine_type = cuisineMatch ? cuisineMatch[1].trim() : undefined

    // Extract tips
    const tipsMatch = recipeText.match(/tips?:(.*?)(?=variations?|servings?|$)/i)
    const tips = tipsMatch ? tipsMatch[1].split('\n').filter(tip => tip.trim()).map(tip => tip.trim()) : []

    // Visual analysis from original analysis
    const visual_analysis = this.extractVisualAnalysis(analysis)

    return {
      dish_name,
      confidence: 0.85, // AI-generated recipes have good confidence
      ingredients,
      cooking_methods,
      estimated_prep_time,
      estimated_cook_time,
      difficulty,
      cuisine_type,
      meal_type,
      description: `AI-generated recipe for ${dish_name} based on visual analysis`,
      tips,
      visual_analysis
    }
  }

  /**
   * Parse ingredients from text
   */
  private parseIngredients(ingredientsText: string): IngredientRecognition[] {
    const lines = ingredientsText.split('\n').filter(line => line.trim())
    return lines.map(line => {
      const cleanLine = line.replace(/^[-*•\d\s\.]+/, '').trim()
      return {
        name: cleanLine,
        confidence: 0.8,
        estimated_amount: this.extractAmount(cleanLine),
        visual_indicators: [],
        alternatives: []
      }
    })
  }

  /**
   * Parse cooking instructions from text
   */
  private parseInstructions(instructionsText: string): string[] {
    const lines = instructionsText.split('\n').filter(line => line.trim())
    return lines.map(line => {
      return line.replace(/^\d+\.\s*/, '').trim()
    })
  }

  /**
   * Extract amount from ingredient text
   */
  private extractAmount(text: string): string {
    const amountMatch = text.match(/^([\d\/\s]+(?:cup|cups|tbsp|tsp|oz|pound|pounds|g|kg|ml|l))/i)
    return amountMatch ? amountMatch[1] : 'to taste'
  }

  /**
   * Extract visual analysis from AI analysis
   */
  private extractVisualAnalysis(analysis: string): any {
    const colors = []
    const textures = []
    const presentation = ''
    const garnishes = []

    // Extract colors
    const colorMatch = analysis.match(/colors?[:\s]*([^\n]+)/i)
    if (colorMatch) {
      colors.push(...colorMatch[1].split(',').map(c => c.trim()))
    }

    // Extract textures
    const textureMatch = analysis.match(/textures?[:\s]*([^\n]+)/i)
    if (textureMatch) {
      textures.push(...textureMatch[1].split(',').map(t => t.trim()))
    }

    // Extract garnishes
    const garnishMatch = analysis.match(/garnishes?[:\s]*([^\n]+)/i)
    if (garnishMatch) {
      garnishes.push(...garnishMatch[1].split(',').map(g => g.trim()))
    }

    return {
      colors,
      textures,
      presentation,
      garnishes
    }
  }

  /**
   * Get alternative recipes for the same dish
   */
  public async getAlternativeRecipes(dishName: string): Promise<any[]> {
    // This could integrate with recipe APIs or databases
    // For now, return empty array
    return []
  }

  /**
   * Validate if the image contains food
   */
  public async validateFoodImage(imageUrl: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Does this image contain food or a cooked dish? Answer with just "yes" or "no".'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageUrl
                  }
                }
              ]
            }
          ],
          max_tokens: 10
        })
      })

      if (!response.ok) {
        return false
      }

      const data = await response.json()
      const answer = data.choices[0].message.content.toLowerCase()
      return answer.includes('yes')
    } catch (error) {
      console.error('Food validation error:', error)
      return false
    }
  }
}

// Export a simple function for easy use
export async function analyzeFoodImage(imageUrl: string, userPreferences?: any): Promise<FoodRecognitionResult> {
  const service = FoodRecognitionService.getInstance()
  return service.analyzeFoodImage({ image_url: imageUrl, user_preferences: userPreferences })
}

export async function validateFoodImage(imageUrl: string): Promise<boolean> {
  const service = FoodRecognitionService.getInstance()
  return service.validateFoodImage(imageUrl)
}

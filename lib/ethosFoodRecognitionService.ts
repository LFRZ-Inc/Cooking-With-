import { createClient } from '@supabase/supabase-js'

export interface EthosFoodRecognitionResult {
  success: boolean
  recipe: {
    title: string
    description: string
    ingredients: Array<{
      name: string
      amount: string
      unit: string
      notes?: string
    }>
    instructions: string[]
    prepTime: string
    cookTime: string
    servings: number
    difficulty: 'Easy' | 'Medium' | 'Hard'
    cuisine: string
    mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Dessert'
    tags: string[]
  }
  analysis: {
    foodItems: string[]
    cookingMethod: string
    estimatedDifficulty: string
    confidence: number
  }
  error?: string
  provider?: 'ethos' | 'openai' | 'fallback'
}

export interface RecipeGenerationRequest {
  imageUrl: string
  userPreferences?: {
    dietaryRestrictions?: string[]
    cuisine?: string
    difficulty?: 'Easy' | 'Medium' | 'Hard'
    servings?: number
  }
}

export class EthosFoodRecognitionService {
  private ethosApiUrl: string
  private supabase: any
  private fallbackToOpenAI: boolean
  private openaiApiKey: string | undefined
  private debug: boolean
  private rateLimiter: Map<string, number[]>

  constructor() {
    // Ethos AI runs locally or on cloud deployment
    this.ethosApiUrl = process.env.ETHOS_AI_URL || 'http://localhost:8000'
    
    // Initialize Supabase client
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Fallback configuration
    this.fallbackToOpenAI = !!process.env.OPENAI_API_KEY
    this.openaiApiKey = process.env.OPENAI_API_KEY

    // Debug mode
    this.debug = process.env.NODE_ENV === 'development' || process.env.DEBUG_ETHOS === 'true'

    // Rate limiting
    this.rateLimiter = new Map<string, number[]>()
  }

  async analyzeFoodImage(request: RecipeGenerationRequest): Promise<EthosFoodRecognitionResult> {
    try {
      console.log('Starting AI food recognition...')
      
      // Check rate limit
      const userId = 'anonymous' // You can get this from auth context
      if (!(await this.checkRateLimit(userId))) {
        return {
          success: false,
          recipe: this.getEmptyRecipe(),
          analysis: {
            foodItems: [],
            cookingMethod: '',
            estimatedDifficulty: 'Unknown',
            confidence: 0
          },
          error: 'Rate limit exceeded. Please try again later.',
          provider: 'fallback'
        }
      }

      // Try Ethos AI first
      try {
        if (this.debug) {
          console.log('Attempting Ethos AI analysis...')
        }
        
        const result = await this.analyzeWithEthosAI(request)
        return { ...result, provider: 'ethos' }
      } catch (ethosError) {
        console.error('Ethos AI failed:', ethosError)
        
        // Fallback to OpenAI if configured
        if (this.fallbackToOpenAI) {
          try {
            if (this.debug) {
              console.log('Falling back to OpenAI...')
            }
            
            const result = await this.analyzeWithOpenAI(request)
            return { ...result, provider: 'openai' }
          } catch (openaiError) {
            console.error('OpenAI fallback also failed:', openaiError)
          }
        }
        
        // Final fallback to basic analysis
        return this.analyzeWithFallback(request)
      }

    } catch (error) {
      console.error('Error in food recognition:', error)
      return {
        success: false,
        recipe: this.getEmptyRecipe(),
        analysis: {
          foodItems: [],
          cookingMethod: '',
          estimatedDifficulty: 'Unknown',
          confidence: 0
        },
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        provider: 'fallback'
      }
    }
  }

  private async analyzeWithEthosAI(request: RecipeGenerationRequest): Promise<EthosFoodRecognitionResult> {
    // Step 1: Validate that the image contains food
    const validationResult = await this.validateFoodImage(request.imageUrl)
    if (!validationResult.isFood) {
      return {
        success: false,
        recipe: this.getEmptyRecipe(),
        analysis: {
          foodItems: [],
          cookingMethod: '',
          estimatedDifficulty: 'Unknown',
          confidence: 0
        },
        error: 'The image does not appear to contain food'
      }
    }

    // Step 2: Analyze the food image with Ethos AI (LLaVA)
    const analysis = await this.analyzeImageWithEthosAI(request.imageUrl)
    
    // Step 3: Generate recipe from analysis
    const recipe = await this.generateRecipeFromAnalysis(analysis, request.userPreferences)
    
    // Step 4: Parse and structure the recipe
    const structuredRecipe = this.parseGeneratedRecipe(recipe, analysis)
    
    return {
      success: true,
      recipe: structuredRecipe,
      analysis: {
        foodItems: validationResult.foodItems || [],
        cookingMethod: analysis.cookingMethod || 'Unknown',
        estimatedDifficulty: analysis.difficulty || 'Medium',
        confidence: validationResult.confidence || 0.7
      }
    }
  }

  private async analyzeWithOpenAI(request: RecipeGenerationRequest): Promise<EthosFoodRecognitionResult> {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `Analyze this food image and generate a complete recipe.
    
    Image URL: ${request.imageUrl}
    
    User Preferences: ${request.userPreferences ? JSON.stringify(request.userPreferences) : 'None'}
    
    Please provide a detailed recipe with:
    - Recipe title
    - Description
    - List of ingredients with amounts
    - Step-by-step cooking instructions
    - Prep time and cook time
    - Number of servings
    - Difficulty level
    - Cuisine type
    - Meal type
    
    Format as JSON:
    {
      "title": "Recipe Title",
      "description": "Description",
      "ingredients": [{"name": "ingredient", "amount": "1", "unit": "cup"}],
      "instructions": ["step 1", "step 2"],
      "prepTime": "15 minutes",
      "cookTime": "30 minutes",
      "servings": 4,
      "difficulty": "Easy",
      "cuisine": "Italian",
      "mealType": "Dinner",
      "tags": ["tag1", "tag2"]
    }`

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
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: request.imageUrl } }
            ]
          }
        ],
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    try {
      const recipe = JSON.parse(content)
      return {
        success: true,
        recipe: {
          title: recipe.title || 'Delicious Recipe',
          description: recipe.description || 'A delicious homemade recipe',
          ingredients: recipe.ingredients || [],
          instructions: recipe.instructions || [],
          prepTime: recipe.prepTime || '15 minutes',
          cookTime: recipe.cookTime || '30 minutes',
          servings: recipe.servings || 4,
          difficulty: recipe.difficulty || 'Medium',
          cuisine: recipe.cuisine || 'International',
          mealType: recipe.mealType || 'Dinner',
          tags: recipe.tags || []
        },
        analysis: {
          foodItems: [],
          cookingMethod: 'Unknown',
          estimatedDifficulty: recipe.difficulty || 'Medium',
          confidence: 0.8
        }
      }
    } catch (parseError) {
      throw new Error('Failed to parse OpenAI response')
    }
  }

  private analyzeWithFallback(request: RecipeGenerationRequest): EthosFoodRecognitionResult {
    // Basic fallback analysis based on image URL or filename
    const imageUrl = request.imageUrl.toLowerCase()
    
    // Extract basic information from URL/filename
    const foodKeywords = ['pasta', 'pizza', 'salad', 'soup', 'bread', 'cake', 'meat', 'fish', 'chicken']
    const detectedFood = foodKeywords.find(keyword => imageUrl.includes(keyword)) || 'dish'
    
    return {
      success: true,
      recipe: {
        title: `Delicious ${detectedFood.charAt(0).toUpperCase() + detectedFood.slice(1)}`,
        description: `A homemade ${detectedFood} recipe`,
        ingredients: [
          { name: 'ingredients', amount: '2', unit: 'cups', notes: 'as needed' },
          { name: 'seasoning', amount: '1', unit: 'tsp', notes: 'to taste' }
        ],
        instructions: [
          'Prepare your ingredients',
          'Follow your favorite recipe method',
          'Cook until done',
          'Serve and enjoy!'
        ],
        prepTime: '15 minutes',
        cookTime: '30 minutes',
        servings: 4,
        difficulty: 'Easy',
        cuisine: 'International',
        mealType: 'Dinner',
        tags: [detectedFood, 'homemade']
      },
      analysis: {
        foodItems: [detectedFood],
        cookingMethod: 'Cook',
        estimatedDifficulty: 'Easy',
        confidence: 0.3
      }
    }
  }

  private async validateFoodImage(imageUrl: string): Promise<{
    isFood: boolean
    foodItems?: string[]
    confidence?: number
  }> {
    try {
      const prompt = `Analyze this image and determine if it contains food. 
      If it contains food, list the main food items you can identify.
      Respond in JSON format: {"isFood": true/false, "foodItems": ["item1", "item2"], "confidence": 0.0-1.0}
      
      Image URL: ${imageUrl}`

      const response = await this.callEthosAI(prompt, 'llava-7b')
      
      try {
        const result = JSON.parse(response.content)
        return {
          isFood: result.isFood || false,
          foodItems: result.foodItems || [],
          confidence: result.confidence || 0.5
        }
      } catch (parseError) {
        // If JSON parsing fails, try to extract information from text
        const content = response.content.toLowerCase()
        const isFood = content.includes('food') || content.includes('dish') || content.includes('meal')
        return {
          isFood,
          confidence: isFood ? 0.6 : 0.3
        }
      }
    } catch (error) {
      console.error('Error validating food image:', error)
      return { isFood: false, confidence: 0 }
    }
  }

  private async analyzeImageWithEthosAI(imageUrl: string): Promise<{
    description: string
    ingredients: string[]
    cookingMethod: string
    difficulty: string
  }> {
    const prompt = `Analyze this food image and provide a detailed description.
    
    Please provide:
    1. A detailed description of what you see
    2. List of ingredients that are likely used
    3. The cooking method (baking, frying, grilling, etc.)
    4. Estimated difficulty level (Easy/Medium/Hard)
    
    Respond in JSON format:
    {
      "description": "detailed description",
      "ingredients": ["ingredient1", "ingredient2"],
      "cookingMethod": "method",
      "difficulty": "Easy/Medium/Hard"
    }
    
    Image URL: ${imageUrl}`

    const response = await this.callEthosAI(prompt, 'llava-7b')
    
    try {
      return JSON.parse(response.content)
    } catch (parseError) {
      // Fallback parsing if JSON fails
      const content = response.content
      return {
        description: content,
        ingredients: this.extractIngredientsFromText(content),
        cookingMethod: this.extractCookingMethodFromText(content),
        difficulty: 'Medium'
      }
    }
  }

  private async generateRecipeFromAnalysis(
    analysis: any, 
    userPreferences?: any
  ): Promise<string> {
    const prompt = `Based on this food analysis, generate a complete recipe.
    
    Analysis: ${JSON.stringify(analysis)}
    
    User Preferences: ${userPreferences ? JSON.stringify(userPreferences) : 'None'}
    
    Generate a detailed recipe with:
    - Recipe title
    - List of ingredients with amounts
    - Step-by-step cooking instructions
    - Prep time and cook time
    - Number of servings
    - Difficulty level
    - Cuisine type
    - Meal type (Breakfast/Lunch/Dinner/Snack/Dessert)
    
    Format the response as a structured recipe.`

    const response = await this.callEthosAI(prompt, 'llama3.2-3b')
    return response.content
  }

  private parseGeneratedRecipe(recipeText: string, analysis: any): any {
    // Parse the AI-generated recipe text into structured format
    const lines = recipeText.split('\n').filter(line => line.trim())
    
    const recipe = {
      title: this.extractTitle(lines),
      description: analysis.description || 'Delicious homemade recipe',
      ingredients: this.extractIngredients(lines),
      instructions: this.extractInstructions(lines),
      prepTime: this.extractTime(lines, 'prep') || '15 minutes',
      cookTime: this.extractTime(lines, 'cook') || '30 minutes',
      servings: this.extractServings(lines) || 4,
      difficulty: this.extractDifficulty(lines) || 'Medium',
      cuisine: this.extractCuisine(lines) || 'International',
      mealType: this.extractMealType(lines) || 'Dinner',
      tags: this.extractTags(lines)
    }

    return recipe
  }

  private async callEthosAI(prompt: string, model: string = 'llama3.2-3b'): Promise<{
    content: string
    model_used: string
  }> {
    const startTime = Date.now()
    
    if (this.debug) {
      console.log(`Calling Ethos AI with model: ${model}`)
      console.log(`API URL: ${this.ethosApiUrl}`)
      console.log(`Prompt: ${prompt.substring(0, 200)}...`)
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60s timeout

      const response = await fetch(`${this.ethosApiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: prompt,
          model_override: model,
          use_tools: false
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Ethos AI API error: ${response.status}`)
      }

      const data = await response.json()
      const duration = Date.now() - startTime
      
      if (this.debug) {
        console.log(`Ethos AI call completed in ${duration}ms`)
        console.log(`Response: ${data.content.substring(0, 200)}...`)
      }

      return {
        content: data.content,
        model_used: data.model_used || model
      }
    } catch (error) {
      const duration = Date.now() - startTime
      console.error(`Ethos AI call failed after ${duration}ms:`, error)
      throw new Error(`Failed to communicate with Ethos AI: ${error}`)
    }
  }

  private async checkRateLimit(userId: string): Promise<boolean> {
    const now = Date.now()
    const userRequests = this.rateLimiter.get(userId) || []
    
    // Remove requests older than 1 hour
    const recentRequests = userRequests.filter(time => now - time < 3600000)
    
    if (recentRequests.length >= 20) { // 20 requests per hour
      return false
    }
    
    recentRequests.push(now)
    this.rateLimiter.set(userId, recentRequests)
    return true
  }

  // Helper methods for parsing recipe text
  private extractTitle(lines: string[]): string {
    const titleLine = lines.find(line => 
      line.toLowerCase().includes('title') || 
      line.toLowerCase().includes('recipe') ||
      (line.length > 0 && line.length < 100 && !line.includes(':'))
    )
    return titleLine ? titleLine.replace(/^title:?\s*/i, '').trim() : 'Delicious Recipe'
  }

  private extractIngredients(lines: string[]): Array<{name: string, amount: string, unit: string, notes?: string}> {
    const ingredients: Array<{name: string, amount: string, unit: string, notes?: string}> = []
    
    for (const line of lines) {
      if (line.toLowerCase().includes('ingredient') || 
          line.match(/^\d+/) || 
          line.includes('cup') || line.includes('tbsp') || line.includes('tsp') ||
          line.includes('gram') || line.includes('ounce') || line.includes('pound')) {
        
        const match = line.match(/(\d+(?:\.\d+)?)\s*(\w+)\s+(.+)/)
        if (match) {
          ingredients.push({
            amount: match[1],
            unit: match[2],
            name: match[3].trim(),
            notes: ''
          })
        } else {
          ingredients.push({
            amount: '1',
            unit: 'piece',
            name: line.trim(),
            notes: ''
          })
        }
      }
    }
    
    return ingredients.length > 0 ? ingredients : [
      { amount: '2', unit: 'cups', name: 'flour', notes: '' },
      { amount: '1', unit: 'cup', name: 'water', notes: '' }
    ]
  }

  private extractInstructions(lines: string[]): string[] {
    const instructions: string[] = []
    let inInstructions = false
    
    for (const line of lines) {
      if (line.toLowerCase().includes('instruction') || line.toLowerCase().includes('step')) {
        inInstructions = true
        continue
      }
      
      if (inInstructions && line.trim()) {
        if (line.match(/^\d+\./) || line.match(/^step/i)) {
          instructions.push(line.replace(/^\d+\.\s*/, '').replace(/^step\s*\d*:?\s*/i, '').trim())
        } else if (instructions.length > 0) {
          instructions[instructions.length - 1] += ' ' + line.trim()
        }
      }
    }
    
    return instructions.length > 0 ? instructions : ['Mix ingredients together', 'Cook until done']
  }

  private extractTime(lines: string[], type: 'prep' | 'cook'): string {
    for (const line of lines) {
      if (line.toLowerCase().includes(type) && line.toLowerCase().includes('time')) {
        const match = line.match(/(\d+)\s*(minute|hour|min|hr)/i)
        if (match) {
          return `${match[1]} ${match[2]}`
        }
      }
    }
    return type === 'prep' ? '15 minutes' : '30 minutes'
  }

  private extractServings(lines: string[]): number {
    for (const line of lines) {
      if (line.toLowerCase().includes('serving')) {
        const match = line.match(/(\d+)/)
        if (match) {
          return parseInt(match[1])
        }
      }
    }
    return 4
  }

  private extractDifficulty(lines: string[]): 'Easy' | 'Medium' | 'Hard' {
    for (const line of lines) {
      const lower = line.toLowerCase()
      if (lower.includes('easy')) return 'Easy'
      if (lower.includes('medium')) return 'Medium'
      if (lower.includes('hard') || lower.includes('difficult')) return 'Hard'
    }
    return 'Medium'
  }

  private extractCuisine(lines: string[]): string {
    const cuisines = ['italian', 'chinese', 'mexican', 'indian', 'french', 'japanese', 'thai', 'mediterranean']
    for (const line of lines) {
      const lower = line.toLowerCase()
      for (const cuisine of cuisines) {
        if (lower.includes(cuisine)) {
          return cuisine.charAt(0).toUpperCase() + cuisine.slice(1)
        }
      }
    }
    return 'International'
  }

  private extractMealType(lines: string[]): 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Dessert' {
    for (const line of lines) {
      const lower = line.toLowerCase()
      if (lower.includes('breakfast')) return 'Breakfast'
      if (lower.includes('lunch')) return 'Lunch'
      if (lower.includes('dinner')) return 'Dinner'
      if (lower.includes('snack')) return 'Snack'
      if (lower.includes('dessert')) return 'Dessert'
    }
    return 'Dinner'
  }

  private extractTags(lines: string[]): string[] {
    const tags: string[] = []
    for (const line of lines) {
      if (line.toLowerCase().includes('tag') || line.includes('#')) {
        const tagMatch = line.match(/#(\w+)/g)
        if (tagMatch) {
          tags.push(...tagMatch.map(tag => tag.substring(1)))
        }
      }
    }
    return tags
  }

  private extractIngredientsFromText(text: string): string[] {
    const ingredients: string[] = []
    const lines = text.split('\n')
    for (const line of lines) {
      if (line.toLowerCase().includes('ingredient') || 
          line.match(/^\d+/) || 
          line.includes('cup') || line.includes('tbsp') || line.includes('tsp')) {
        ingredients.push(line.trim())
      }
    }
    return ingredients
  }

  private extractCookingMethodFromText(text: string): string {
    const methods = ['bake', 'fry', 'grill', 'roast', 'steam', 'boil', 'saute', 'stir-fry']
    const lower = text.toLowerCase()
    for (const method of methods) {
      if (lower.includes(method)) {
        return method.charAt(0).toUpperCase() + method.slice(1)
      }
    }
    return 'Cook'
  }

  private getEmptyRecipe(): any {
    return {
      title: 'Recipe Not Found',
      description: 'Unable to generate recipe from image',
      ingredients: [],
      instructions: [],
      prepTime: '0 minutes',
      cookTime: '0 minutes',
      servings: 1,
      difficulty: 'Easy' as const,
      cuisine: 'Unknown',
      mealType: 'Dinner' as const,
      tags: []
    }
  }
}

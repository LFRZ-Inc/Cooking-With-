'use client'

import { supabase } from './supabase'

export interface ParsedRecipe {
  title: string
  description?: string
  ingredients: string[]
  instructions: string[]
  prep_time_minutes?: number
  cook_time_minutes?: number
  servings?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  cuisine_type?: string
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack'
  tags?: string[]
  image_url?: string
  source_url?: string
  confidence_score: number
}

export interface ImportSource {
  domain: string
  site_name: string
  recipe_pattern: string
  extraction_rules: {
    title: string
    ingredients: string
    instructions: string
    description?: string
    prep_time?: string
    cook_time?: string
    servings?: string
    image?: string
  }
}

export class RecipeParser {
  private static instance: RecipeParser
  private importSources: Map<string, ImportSource> = new Map()

  static getInstance(): RecipeParser {
    if (!RecipeParser.instance) {
      RecipeParser.instance = new RecipeParser()
    }
    return RecipeParser.instance
  }

  // Load import sources from database
  async loadImportSources(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('import_sources')
        .select('*')
        .eq('is_active', true)

      if (error) throw error

      this.importSources.clear()
      data?.forEach(source => {
        this.importSources.set(source.domain, {
          domain: source.domain,
          site_name: source.site_name,
          recipe_pattern: source.recipe_pattern,
          extraction_rules: source.extraction_rules
        })
      })
    } catch (error) {
      console.error('Error loading import sources:', error)
    }
  }

  // Parse recipe from webpage URL
  async parseFromWebpage(url: string): Promise<ParsedRecipe | null> {
    try {
      const domain = this.extractDomain(url)
      const source = this.importSources.get(domain)

      if (!source) {
        return await this.parseGenericWebpage(url)
      }

      return await this.parseWithTemplate(url, source)
    } catch (error) {
      console.error('Error parsing webpage:', error)
      return null
    }
  }

  // Parse recipe from image (OCR)
  async parseFromImage(imageData: string): Promise<ParsedRecipe | null> {
    try {
      // This would integrate with OCR service like Google Vision API
      // For now, we'll return a mock implementation
      return await this.parseImageWithOCR(imageData)
    } catch (error) {
      console.error('Error parsing image:', error)
      return null
    }
  }

  // Parse recipe from text
  async parseFromText(text: string): Promise<ParsedRecipe | null> {
    try {
      return await this.parseTextContent(text)
    } catch (error) {
      console.error('Error parsing text:', error)
      return null
    }
  }

  // Extract domain from URL
  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.replace('www.', '')
    } catch {
      return ''
    }
  }

  // Parse webpage with specific template
  private async parseWithTemplate(url: string, source: ImportSource): Promise<ParsedRecipe | null> {
    try {
      // In a real implementation, this would fetch the webpage and extract content
      // For now, we'll simulate the extraction process
      const mockContent = await this.fetchWebpageContent(url)
      
      return {
        title: this.extractTitle(mockContent, source.extraction_rules.title),
        description: this.extractDescription(mockContent, source.extraction_rules.description),
        ingredients: this.extractIngredients(mockContent, source.extraction_rules.ingredients),
        instructions: this.extractInstructions(mockContent, source.extraction_rules.instructions),
        prep_time_minutes: this.extractPrepTime(mockContent, source.extraction_rules.prep_time),
        cook_time_minutes: this.extractCookTime(mockContent, source.extraction_rules.cook_time),
        servings: this.extractServings(mockContent, source.extraction_rules.servings),
        image_url: this.extractImage(mockContent, source.extraction_rules.image),
        source_url: url,
        confidence_score: 0.85
      }
    } catch (error) {
      console.error('Error parsing with template:', error)
      return null
    }
  }

  // Parse generic webpage (fallback)
  private async parseGenericWebpage(url: string): Promise<ParsedRecipe | null> {
    try {
      const mockContent = await this.fetchWebpageContent(url)
      
      return {
        title: this.extractGenericTitle(mockContent),
        ingredients: this.extractGenericIngredients(mockContent),
        instructions: this.extractGenericInstructions(mockContent),
        source_url: url,
        confidence_score: 0.65
      }
    } catch (error) {
      console.error('Error parsing generic webpage:', error)
      return null
    }
  }

  // Parse image with OCR
  private async parseImageWithOCR(imageData: string): Promise<ParsedRecipe | null> {
    try {
      // Mock OCR implementation
      const mockOCRText = await this.performOCR(imageData)
      return await this.parseFromText(mockOCRText)
    } catch (error) {
      console.error('Error parsing image with OCR:', error)
      return null
    }
  }

  // Parse text content
  private async parseTextContent(text: string): Promise<ParsedRecipe | null> {
    try {
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
      
      const recipe: ParsedRecipe = {
        title: '',
        ingredients: [],
        instructions: [],
        confidence_score: 0.7
      }

      let currentSection = 'title'
      let ingredientSection = false
      let instructionSection = false

      for (const line of lines) {
        const lowerLine = line.toLowerCase()

        // Detect sections
        if (lowerLine.includes('ingredients') || lowerLine.includes('ingredient')) {
          ingredientSection = true
          instructionSection = false
          continue
        }

        if (lowerLine.includes('instructions') || lowerLine.includes('directions') || lowerLine.includes('method')) {
          ingredientSection = false
          instructionSection = true
          continue
        }

        // Extract title (first non-empty line)
        if (!recipe.title && line.length > 0 && !ingredientSection && !instructionSection) {
          recipe.title = line
          continue
        }

        // Extract ingredients
        if (ingredientSection && line.length > 0) {
          // Skip section headers
          if (lowerLine.includes('ingredients') || lowerLine.includes('ingredient')) {
            continue
          }
          
          // Check if line looks like an ingredient
          if (this.isIngredientLine(line)) {
            recipe.ingredients.push(line)
          }
        }

        // Extract instructions
        if (instructionSection && line.length > 0) {
          // Skip section headers
          if (lowerLine.includes('instructions') || lowerLine.includes('directions') || lowerLine.includes('method')) {
            continue
          }
          
          // Check if line looks like an instruction
          if (this.isInstructionLine(line)) {
            recipe.instructions.push(line)
          }
        }
      }

      // Extract additional metadata
      recipe.prep_time_minutes = this.extractTimeFromText(text, 'prep')
      recipe.cook_time_minutes = this.extractTimeFromText(text, 'cook')
      recipe.servings = this.extractServingsFromText(text)
      recipe.difficulty = this.extractDifficultyFromText(text)
      recipe.cuisine_type = this.extractCuisineFromText(text)
      recipe.meal_type = this.extractMealTypeFromText(text)

      return recipe
    } catch (error) {
      console.error('Error parsing text content:', error)
      return null
    }
  }

  // Helper methods for text extraction
  private isIngredientLine(line: string): boolean {
    const lowerLine = line.toLowerCase()
    
    // Common ingredient patterns
    const ingredientPatterns = [
      /\d+\s*(cup|tbsp|tsp|oz|lb|g|kg|ml|l)/i,
      /\d+\/\d+/,
      /\d+\s*(to taste|as needed)/i,
      /^[a-z]+\s*(\([^)]+\))?$/i,
      /salt|pepper|oil|butter|flour|sugar/i
    ]

    return ingredientPatterns.some(pattern => pattern.test(line))
  }

  private isInstructionLine(line: string): boolean {
    const lowerLine = line.toLowerCase()
    
    // Skip lines that are likely ingredients
    if (this.isIngredientLine(line)) {
      return false
    }

    // Common instruction patterns
    const instructionPatterns = [
      /^step\s*\d+/i,
      /^\d+\./,
      /^[a-z]+\s+the/i,
      /preheat|mix|combine|add|stir|heat|bake|cook/i
    ]

    return instructionPatterns.some(pattern => pattern.test(line)) || line.length > 20
  }

  private extractTimeFromText(text: string, timeType: 'prep' | 'cook'): number | undefined {
    const regex = new RegExp(`(${timeType}|preparation|cooking)\\s*time[\\s:]*([\\d.]+)\\s*(min|minutes|hour|hours)`, 'i')
    const match = text.match(regex)
    
    if (match) {
      const time = parseFloat(match[2])
      const unit = match[3].toLowerCase()
      
      if (unit.includes('hour')) {
        return Math.round(time * 60)
      }
      return Math.round(time)
    }
    
    return undefined
  }

  private extractServingsFromText(text: string): number | undefined {
    const regex = /serves?\s*(\d+)|(\d+)\s*servings?/i
    const match = text.match(regex)
    
    if (match) {
      return parseInt(match[1] || match[2])
    }
    
    return undefined
  }

  private extractDifficultyFromText(text: string): 'easy' | 'medium' | 'hard' | undefined {
    const lowerText = text.toLowerCase()
    
    if (lowerText.includes('easy') || lowerText.includes('beginner')) {
      return 'easy'
    }
    if (lowerText.includes('hard') || lowerText.includes('advanced') || lowerText.includes('expert')) {
      return 'hard'
    }
    if (lowerText.includes('medium') || lowerText.includes('intermediate')) {
      return 'medium'
    }
    
    return undefined
  }

  private extractCuisineFromText(text: string): string | undefined {
    const cuisines = [
      'italian', 'mexican', 'chinese', 'japanese', 'indian', 'french', 'thai',
      'mediterranean', 'american', 'greek', 'spanish', 'korean', 'vietnamese'
    ]
    
    const lowerText = text.toLowerCase()
    for (const cuisine of cuisines) {
      if (lowerText.includes(cuisine)) {
        return cuisine
      }
    }
    
    return undefined
  }

  private extractMealTypeFromText(text: string): 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack' | undefined {
    const lowerText = text.toLowerCase()
    
    if (lowerText.includes('breakfast') || lowerText.includes('pancake') || lowerText.includes('waffle')) {
      return 'breakfast'
    }
    if (lowerText.includes('lunch') || lowerText.includes('sandwich') || lowerText.includes('salad')) {
      return 'lunch'
    }
    if (lowerText.includes('dinner') || lowerText.includes('main course') || lowerText.includes('entree')) {
      return 'dinner'
    }
    if (lowerText.includes('dessert') || lowerText.includes('cake') || lowerText.includes('cookie')) {
      return 'dessert'
    }
    if (lowerText.includes('snack') || lowerText.includes('appetizer')) {
      return 'snack'
    }
    
    return undefined
  }

  // Mock methods for demonstration
  private async fetchWebpageContent(url: string): Promise<string> {
    // In a real implementation, this would fetch the actual webpage
    // For now, return mock content
    return `
      <html>
        <head><title>Delicious Chocolate Cake Recipe</title></head>
        <body>
          <h1>Delicious Chocolate Cake Recipe</h1>
          <p>This is a wonderful chocolate cake recipe that everyone will love.</p>
          <h2>Ingredients</h2>
          <ul>
            <li>2 cups all-purpose flour</li>
            <li>1 3/4 cups sugar</li>
            <li>3/4 cup unsweetened cocoa powder</li>
            <li>1 1/2 teaspoons baking soda</li>
            <li>1 1/2 teaspoons baking powder</li>
            <li>1 teaspoon salt</li>
            <li>2 eggs</li>
            <li>1 cup milk</li>
            <li>1/2 cup vegetable oil</li>
            <li>2 teaspoons vanilla extract</li>
            <li>1 cup hot water</li>
          </ul>
          <h2>Instructions</h2>
          <ol>
            <li>Preheat oven to 350°F (175°C). Grease and flour a 9x13 inch pan.</li>
            <li>In a large bowl, combine flour, sugar, cocoa, baking soda, baking powder and salt.</li>
            <li>Add eggs, milk, oil and vanilla. Mix until smooth.</li>
            <li>Stir in hot water. Batter will be very thin.</li>
            <li>Pour into prepared pan and bake for 30 to 35 minutes.</li>
            <li>Cool in pan for 10 minutes, then remove from pan and cool completely.</li>
          </ol>
          <p>Prep time: 15 minutes | Cook time: 35 minutes | Serves: 12</p>
        </body>
      </html>
    `
  }

  private async performOCR(imageData: string): Promise<string> {
    // Mock OCR implementation
    return `
      Delicious Chocolate Cake Recipe
      
      Ingredients:
      - 2 cups all-purpose flour
      - 1 3/4 cups sugar
      - 3/4 cup unsweetened cocoa powder
      - 1 1/2 teaspoons baking soda
      - 1 1/2 teaspoons baking powder
      - 1 teaspoon salt
      - 2 eggs
      - 1 cup milk
      - 1/2 cup vegetable oil
      - 2 teaspoons vanilla extract
      - 1 cup hot water
      
      Instructions:
      1. Preheat oven to 350°F (175°C). Grease and flour a 9x13 inch pan.
      2. In a large bowl, combine flour, sugar, cocoa, baking soda, baking powder and salt.
      3. Add eggs, milk, oil and vanilla. Mix until smooth.
      4. Stir in hot water. Batter will be very thin.
      5. Pour into prepared pan and bake for 30 to 35 minutes.
      6. Cool in pan for 10 minutes, then remove from pan and cool completely.
      
      Prep time: 15 minutes
      Cook time: 35 minutes
      Serves: 12
    `
  }

  // Extract methods for specific fields
  private extractTitle(content: string, selector: string): string {
    // Mock implementation - in real app would use DOM parsing
    const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/i)
    return titleMatch ? titleMatch[1].trim() : 'Untitled Recipe'
  }

  private extractDescription(content: string, selector?: string): string | undefined {
    const descMatch = content.match(/<p[^>]*>([^<]+)<\/p>/i)
    return descMatch ? descMatch[1].trim() : undefined
  }

  private extractIngredients(content: string, selector: string): string[] {
    const ingredients: string[] = []
    const ingredientMatches = content.match(/<li[^>]*>([^<]+)<\/li>/g)
    
    if (ingredientMatches) {
      ingredientMatches.forEach(match => {
        const ingredient = match.replace(/<[^>]*>/g, '').trim()
        if (ingredient && !ingredient.toLowerCase().includes('ingredients')) {
          ingredients.push(ingredient)
        }
      })
    }
    
    return ingredients
  }

  private extractInstructions(content: string, selector: string): string[] {
    const instructions: string[] = []
    const instructionMatches = content.match(/<li[^>]*>([^<]+)<\/li>/g)
    
    if (instructionMatches) {
      instructionMatches.forEach(match => {
        const instruction = match.replace(/<[^>]*>/g, '').trim()
        if (instruction && !instruction.toLowerCase().includes('instructions')) {
          instructions.push(instruction)
        }
      })
    }
    
    return instructions
  }

  private extractPrepTime(content: string, selector?: string): number | undefined {
    const timeMatch = content.match(/prep time[:\s]*(\d+)/i)
    return timeMatch ? parseInt(timeMatch[1]) : undefined
  }

  private extractCookTime(content: string, selector?: string): number | undefined {
    const timeMatch = content.match(/cook time[:\s]*(\d+)/i)
    return timeMatch ? parseInt(timeMatch[1]) : undefined
  }

  private extractServings(content: string, selector?: string): number | undefined {
    const servingsMatch = content.match(/serves[:\s]*(\d+)/i)
    return servingsMatch ? parseInt(servingsMatch[1]) : undefined
  }

  private extractImage(content: string, selector?: string): string | undefined {
    const imageMatch = content.match(/<img[^>]*src="([^"]+)"/i)
    return imageMatch ? imageMatch[1] : undefined
  }

  private extractGenericTitle(content: string): string {
    return this.extractTitle(content, 'h1')
  }

  private extractGenericIngredients(content: string): string[] {
    return this.extractIngredients(content, 'li')
  }

  private extractGenericInstructions(content: string): string[] {
    return this.extractInstructions(content, 'li')
  }
}

// Export singleton instance
export const recipeParser = RecipeParser.getInstance() 
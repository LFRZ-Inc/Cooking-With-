import { supabase } from './supabase'
import { parse } from 'node-html-parser'

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
      const html = await this.fetchWebpageContent(url)
      if (!html) {
        console.error('Failed to fetch webpage content')
        return null
      }
      
      const root = parse(html)
      const selectText = (selector?: string) => {
        if (!selector) return undefined
        const element = root.querySelector(selector)
        return element?.text?.replace(/\s+/g, ' ').trim() || undefined
      }
      const selectImage = (selector?: string) => {
        if (!selector) return undefined
        const element = root.querySelector(selector)
        return element?.getAttribute('src') || element?.querySelector('img')?.getAttribute('src') || undefined
      }
      const selectList = (selector: string) => {
        const items: string[] = []
        root.querySelectorAll(selector).forEach(el => {
          const txt = el.text?.replace(/\s+/g, ' ').trim()
          if (txt) items.push(txt)
        })
        return items
      }

      const title = selectText(source.extraction_rules.title) || this.extractGenericTitle(html)
      const description = selectText(source.extraction_rules.description)
      const ingredients = source.extraction_rules.ingredients ? selectList(source.extraction_rules.ingredients) : this.extractGenericIngredients(html)
      const instructions = source.extraction_rules.instructions ? selectList(source.extraction_rules.instructions) : this.extractGenericInstructions(html)
      const image_url = selectImage(source.extraction_rules.image)
      const prep_time_minutes = this.extractPrepTime(html, source.extraction_rules.prep_time)
      const cook_time_minutes = this.extractCookTime(html, source.extraction_rules.cook_time)
      const servings = this.extractServings(html, source.extraction_rules.servings)

      return {
        title,
        description,
        ingredients,
        instructions,
        prep_time_minutes,
        cook_time_minutes,
        servings,
        image_url,
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
      // Fallback generic extraction via node-html-parser when no template exists
      try {
        const root = parse(mockContent)
        const title = root.querySelector('h1')?.text.trim() || this.extractGenericTitle(mockContent)
        const ingredients = root.querySelectorAll('li').map(el => el.text.trim()).filter(Boolean)
        const instructionCandidates = root.querySelectorAll('ol li, .instructions li, .method li').map(el => el.text.trim()).filter(Boolean)
        const instructions = instructionCandidates.length ? instructionCandidates : ingredients.slice(-6)

        return {
          title,
          ingredients,
          instructions,
          source_url: url,
          confidence_score: 0.65
        }
      } catch {}

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

  private async fetchWebpageContent(url: string): Promise<string> {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CookingWithBot/1.0; +https://example.com/bot)',
        'Accept': 'text/html,application/xhtml+xml',
      },
    })
    if (!res.ok) {
      throw new Error(`Failed to fetch page: ${res.status}`)
    }
    return await res.text()
  }

  private async performOCR(imageData: string): Promise<string> {
    // Use Tesseract.js in Node to OCR base64 image data
    const { createWorker } = await import('tesseract.js')
    const worker = await createWorker('eng')
    try {
      const { data } = await worker.recognize(imageData)
      await worker.terminate()
      return data.text || ''
    } catch (e) {
      try { await worker.terminate() } catch {}
      console.error('OCR error:', e)
      return ''
    }
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
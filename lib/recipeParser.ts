// Recipe Parser for Cooking With! Platform
// Handles parsing of recipe text from various sources including OCR

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
  image_url?: string
  source_url?: string
  confidence_score: number
  parsing_notes?: string[]
  provider?: 'local' | 'ethos' | 'openai'
}

export interface ParsingResult {
  recipe: ParsedRecipe
  success: boolean
  errors?: string[]
  warnings?: string[]
}

// Enhanced ingredient patterns for better OCR text handling
const INGREDIENT_PATTERNS = [
  // Standard patterns
  /^[\d\/\s]+(cup|cups|tbsp|tsp|oz|pound|pounds|g|kg|ml|l|clove|cloves|slice|slices|can|cans|package|packages|bunch|bunches|head|heads|stalk|stalks|sprig|sprigs|dash|pinch|to taste)/i,
  /^[\d\/\s]+(teaspoon|teaspoons|tablespoon|tablespoons|ounce|ounces|gram|grams|kilogram|kilograms|milliliter|milliliters|liter|liters)/i,
  /^[\d\/\s]+(large|medium|small|extra large|xl|lg|med|sm)\s+(egg|eggs|onion|onions|tomato|tomatoes|potato|potatoes|carrot|carrots|bell pepper|bell peppers)/i,
  /^[\d\/\s]+(fresh|dried|ground|whole|chopped|diced|minced|sliced|grated|shredded|crushed|softened|melted|room temperature)/i,
  /^[\d\/\s]+(salt|pepper|sugar|flour|oil|butter|milk|water|broth|stock|sauce|vinegar|lemon juice|lime juice|garlic|onion|herbs|spices)/i,
  // OCR-friendly patterns (handles garbled text)
  /^[\d\/\s]+(cup|cups|tbsp|tsp|oz|pound|pounds|g|kg|ml|l|clove|cloves|slice|slices|can|cans|package|packages|bunch|bunches|head|heads|stalk|stalks|sprig|sprigs|dash|pinch|to taste)/i,
  /^[\d\/\s]+(teaspoon|teaspoons|tablespoon|tablespoons|ounce|ounces|gram|grams|kilogram|kilograms|milliliter|milliliters|liter|liters)/i,
  // Common ingredient words that might be garbled
  /(salt|pepper|sugar|flour|oil|butter|milk|water|egg|onion|garlic|tomato|cheese|meat|chicken|beef|pork|fish|vegetable|herb|spice|carrot|potato|lettuce|spinach|kale|broccoli|cauliflower|pepper|mushroom|zucchini|squash|pasta|rice|bread|cheese|cream|sauce|vinegar|lemon|lime|orange|apple|banana|strawberry|blueberry|raspberry|chocolate|vanilla|cinnamon|nutmeg|oregano|basil|thyme|rosemary|parsley|cilantro|dill|mint|bay leaf|bay leaves)/i
]

// Enhanced instruction patterns for better OCR text handling
const INSTRUCTION_PATTERNS = [
  // Standard cooking verbs
  /^(preheat|heat|warm|bring|boil|simmer|fry|sauté|bake|roast|grill|broil|steam|poach|blanch|caramelize|reduce|thicken|whisk|beat|mix|stir|fold|knead|roll|cut|chop|dice|mince|slice|grate|shred|crush|mash|purée|blend|process|strain|drain|rinse|pat dry|season|marinate|rest|cool|chill|freeze|thaw|serve|garnish|decorate)/i,
  // OCR-friendly patterns (handles garbled text)
  /^(add|combine|mix|stir|whisk|beat|fold|knead|roll|cut|chop|dice|mince|slice|grate|shred|crush|mash|purée|blend|process|strain|drain|rinse|pat dry|season|marinate|rest|cool|chill|freeze|thaw|serve|garnish|decorate)/i,
  // Transition words
  /^(until|while|when|after|before|during|meanwhile|then|next|finally|lastly|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)/i,
  // Numbered steps (OCR-friendly)
  /^\d+\./,
  /^\d+\)/,
  /^step\s*\d+/i,
  /^instruction\s*\d+/i
]

// Time patterns
const TIME_PATTERNS = [
  /(\d+)\s*(minute|minutes|min|mins)/i,
  /(\d+)\s*(hour|hours|hr|hrs)/i,
  /(\d+)\s*(second|seconds|sec|secs)/i,
  /(\d+)\s*(day|days)/i
]

// Serving patterns
const SERVING_PATTERNS = [
  /(\d+)\s*(serving|servings|person|people|portion|portions)/i,
  /serves\s*(\d+)/i,
  /yield[s]?\s*(\d+)/i,
  /makes\s*(\d+)/i
]

// Difficulty patterns
const DIFFICULTY_PATTERNS = [
  { pattern: /(easy|simple|quick|fast|beginner|basic)/i, value: 'easy' as const },
  { pattern: /(medium|moderate|intermediate|average)/i, value: 'medium' as const },
  { pattern: /(hard|difficult|complex|advanced|expert|challenging)/i, value: 'hard' as const }
]

// Meal type patterns
const MEAL_TYPE_PATTERNS = [
  { pattern: /(breakfast|morning|brunch)/i, value: 'breakfast' as const },
  { pattern: /(lunch|midday|noon)/i, value: 'lunch' as const },
  { pattern: /(dinner|evening|supper|main course)/i, value: 'dinner' as const },
  { pattern: /(dessert|sweet|treat|cake|cookie|pie|ice cream)/i, value: 'dessert' as const },
  { pattern: /(snack|appetizer|starter|hors d'oeuvre)/i, value: 'snack' as const }
]

export class RecipeParser {
  private text: string
  private lines: string[]
  private parsingNotes: string[]
  private useEthosAI: boolean

  constructor(text: string, useEthosAI: boolean = false) {
    this.text = this.cleanText(text)
    this.lines = this.text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    this.parsingNotes = []
    this.useEthosAI = useEthosAI
  }

  private cleanText(text: string): string {
    return text
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
      // More aggressive cleaning for OCR text
      .replace(/[^\w\s\n\-.,;:()\/°]/g, '') // Remove special characters but keep basic punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .trim()
  }

  private async tryEthosAIParsing(): Promise<ParsedRecipe | null> {
    try {
      const ethosUrl = process.env.ETHOS_AI_URL || 'http://localhost:8000'
      
      const response = await fetch(`${ethosUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `Please parse this recipe text and return a JSON object with the following structure:
{
  "title": "Recipe title",
  "description": "Recipe description",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "instructions": ["step 1", "step 2"],
  "prep_time_minutes": 15,
  "cook_time_minutes": 30,
  "servings": 4,
  "difficulty": "easy",
  "cuisine_type": "italian",
  "meal_type": "dinner"
}

Recipe text:
${this.text}`,
          model_override: 'llama3.2:3b'
        })
      })

      if (!response.ok) {
        throw new Error(`Ethos AI request failed: ${response.status}`)
      }

      const data = await response.json()
      
      // Try to extract JSON from the response
      const jsonMatch = data.content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          title: parsed.title || 'Untitled Recipe',
          description: parsed.description || '',
          ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : [],
          instructions: Array.isArray(parsed.instructions) ? parsed.instructions : [],
          prep_time_minutes: parsed.prep_time_minutes || 0,
          cook_time_minutes: parsed.cook_time_minutes || 0,
          servings: parsed.servings || 4,
          difficulty: parsed.difficulty || 'medium',
          cuisine_type: parsed.cuisine_type || '',
          meal_type: parsed.meal_type || 'dinner',
          confidence_score: 0.8,
          parsing_notes: ['Parsed using Ethos AI'],
          provider: 'ethos'
        }
      }
    } catch (error) {
      console.error('Ethos AI parsing failed:', error)
      this.parsingNotes.push('Ethos AI parsing failed, falling back to local parsing')
    }
    
    return null
  }

  private extractTitle(): string {
    // Look for the first line that could be a title
    for (let i = 0; i < Math.min(5, this.lines.length); i++) {
      const line = this.lines[i]
      
      // Skip common non-title patterns
      if (this.looksLikeIngredient(line) || this.looksLikeInstruction(line) || this.isSectionHeader(line)) {
        continue
      }
      
             // Check if line looks like a title (not too long, not all caps, not a number)
       if (line.length > 3 && line.length < 100 && !/^\d+$/.test(line) && line.toUpperCase() !== line) {
        this.parsingNotes.push(`Found title: ${line}`)
        return line
      }
    }
    
    return 'Untitled Recipe'
  }

  private extractIngredients(): string[] {
    const ingredients: string[] = []
    let inIngredientsSection = false
    let ingredientsStartIndex = -1

    // Find ingredients section
    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i].toLowerCase()
      
      if (line.includes('ingredient') || line.includes('ingredients')) {
        inIngredientsSection = true
        ingredientsStartIndex = i
        break
      }
    }

    // If no ingredients section found, look for ingredient-like lines
    if (ingredientsStartIndex === -1) {
      for (let i = 0; i < this.lines.length; i++) {
        const line = this.lines[i]
        if (this.looksLikeIngredient(line)) {
          ingredientsStartIndex = i
          break
        }
      }
    }

    // Extract ingredients
    if (ingredientsStartIndex !== -1) {
      for (let i = ingredientsStartIndex + 1; i < this.lines.length; i++) {
        const line = this.lines[i]
        
        // Stop if we hit instructions section
        if (this.looksLikeInstructionsSection(line)) {
          break
        }
        
        // Skip empty lines and section headers
        if (line.length === 0 || this.isSectionHeader(line)) {
          continue
        }
        
        // Check if this looks like an ingredient
        if (this.looksLikeIngredient(line)) {
          const cleanedIngredient = this.cleanIngredient(line)
          if (cleanedIngredient.length > 0) {
            ingredients.push(cleanedIngredient)
          }
        }
      }
    }

    this.parsingNotes.push(`Extracted ${ingredients.length} ingredients`)
    return ingredients
  }

  private looksLikeIngredient(line: string): boolean {
    // Check for common ingredient patterns
    return INGREDIENT_PATTERNS.some(pattern => pattern.test(line)) ||
           // Check for lines that start with quantities
           /^[\d\/\s]+/.test(line) ||
           // Check for common ingredient words (including OCR-garbled versions)
           /(salt|pepper|sugar|flour|oil|butter|milk|water|egg|onion|garlic|tomato|cheese|meat|chicken|beef|pork|fish|vegetable|herb|spice|carrot|potato|lettuce|spinach|kale|broccoli|cauliflower|pepper|mushroom|zucchini|squash|pasta|rice|bread|cheese|cream|sauce|vinegar|lemon|lime|orange|apple|banana|strawberry|blueberry|raspberry|chocolate|vanilla|cinnamon|nutmeg|oregano|basil|thyme|rosemary|parsley|cilantro|dill|mint|bay leaf|bay leaves)/i.test(line)
  }

  private cleanIngredient(ingredient: string): string {
    return ingredient
      .replace(/^[-*•\d\s\.]+/, '') // Remove bullets, numbers, and leading whitespace
      .replace(/\s+/, ' ') // Normalize whitespace
      .trim()
  }

  private looksLikeInstructionsSection(line: string): boolean {
    const instructionHeaders = [
      'instructions', 'directions', 'method', 'steps', 'preparation', 'how to', 'procedure'
    ]
    return instructionHeaders.some(header => line.toLowerCase().includes(header))
  }

  private isSectionHeader(line: string): boolean {
    const sectionHeaders = [
      'ingredients', 'directions', 'instructions', 'method', 'steps', 'preparation',
      'serves', 'yield', 'makes', 'prep time', 'cook time', 'total time', 'difficulty'
    ]
    return sectionHeaders.some(header => line.toLowerCase().includes(header))
  }

  private extractInstructions(): string[] {
    const instructions: string[] = []
    let inInstructionsSection = false
    let instructionsStartIndex = -1

    // Find instructions section
    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i].toLowerCase()
      
      if (this.looksLikeInstructionsSection(line)) {
        inInstructionsSection = true
        instructionsStartIndex = i
        break
      }
    }

    // If no instructions section found, look for numbered steps or instruction-like lines
    if (instructionsStartIndex === -1) {
      for (let i = 0; i < this.lines.length; i++) {
        const line = this.lines[i]
        if (/^\d+\./.test(line) || /^\d+\)/.test(line) || this.looksLikeInstruction(line)) {
          instructionsStartIndex = i
          break
        }
      }
    }

    // If still no instructions found, look for any lines that contain cooking verbs
    if (instructionsStartIndex === -1) {
      for (let i = 0; i < this.lines.length; i++) {
        const line = this.lines[i]
        if (this.looksLikeInstruction(line) && line.length > 10) {
          instructionsStartIndex = i
          break
        }
      }
    }

    // Extract instructions
    if (instructionsStartIndex !== -1) {
      let currentInstruction = ''
      
      for (let i = instructionsStartIndex + 1; i < this.lines.length; i++) {
        const line = this.lines[i]
        
        // Skip empty lines and section headers
        if (line.length === 0 || this.isSectionHeader(line)) {
          continue
        }
        
        // Check if this is a new instruction (numbered or starts with action verb)
        if (/^\d+\./.test(line) || /^\d+\)/.test(line) || this.looksLikeNewInstruction(line)) {
          // Save previous instruction if it exists
          if (currentInstruction.trim()) {
            instructions.push(currentInstruction.trim())
          }
          currentInstruction = this.cleanInstruction(line)
        } else {
          // Continue current instruction
          currentInstruction += ' ' + line
        }
      }
      
      // Add the last instruction
      if (currentInstruction.trim()) {
        instructions.push(currentInstruction.trim())
      }
    }

    // If no instructions found, try to create instructions from any remaining text
    if (instructions.length === 0) {
      const remainingLines = this.lines.filter(line => 
        line.length > 10 && 
        !this.looksLikeIngredient(line) && 
        !this.isSectionHeader(line) &&
        !line.toLowerCase().includes('ingredient')
      )
      
      if (remainingLines.length > 0) {
        instructions.push(...remainingLines.map(line => this.cleanInstruction(line)))
      }
    }

    this.parsingNotes.push(`Extracted ${instructions.length} instructions`)
    return instructions
  }

  private looksLikeInstruction(line: string): boolean {
    return INSTRUCTION_PATTERNS.some(pattern => pattern.test(line))
  }

  private looksLikeNewInstruction(line: string): boolean {
    // Check if line starts with common instruction verbs
    return /^(preheat|heat|add|combine|mix|stir|whisk|beat|fold|knead|roll|cut|chop|dice|mince|slice|grate|shred|crush|mash|purée|blend|process|strain|drain|rinse|pat dry|season|marinate|rest|cool|chill|freeze|thaw|serve|garnish|decorate)/i.test(line)
  }

  private cleanInstruction(instruction: string): string {
    return instruction
      .replace(/^\d+\.\s*/, '') // Remove numbering
      .replace(/^\d+\)\s*/, '') // Remove numbering with parentheses
      .replace(/^[-*•\s]+/, '') // Remove bullets and leading whitespace
      .replace(/\s+/, ' ') // Normalize whitespace
      .trim()
  }

  private extractTime(text: string, type: 'prep' | 'cook'): number {
    const timePatterns = [
      new RegExp(`${type}\\s*time[\\s:]*(${TIME_PATTERNS.map(p => p.source).join('|')})`, 'i'),
      new RegExp(`(${TIME_PATTERNS.map(p => p.source).join('|')})`, 'i')
    ]

    for (const pattern of timePatterns) {
      const match = text.match(pattern)
      if (match) {
        const timeStr = match[1] || match[0]
        const timeMatch = timeStr.match(/(\d+)\s*(minute|minutes|min|mins|hour|hours|hr|hrs|second|seconds|sec|secs|day|days)/i)
        
        if (timeMatch) {
          const value = parseInt(timeMatch[1])
          const unit = timeMatch[2].toLowerCase()
          
          // Convert to minutes
          if (unit.includes('hour') || unit.includes('hr')) {
            return value * 60
          } else if (unit.includes('day')) {
            return value * 24 * 60
          } else if (unit.includes('second') || unit.includes('sec')) {
            return Math.ceil(value / 60)
          } else {
            return value // Already in minutes
          }
        }
      }
    }

    return 0
  }

  private extractServings(): number {
    for (const pattern of SERVING_PATTERNS) {
      const match = this.text.match(pattern)
      if (match) {
        const servings = parseInt(match[1])
        if (servings > 0 && servings <= 50) { // Reasonable range
          this.parsingNotes.push(`Found servings: ${servings}`)
          return servings
        }
      }
    }
    return 4 // Default servings
  }

  private extractDifficulty(): 'easy' | 'medium' | 'hard' {
    for (const { pattern, value } of DIFFICULTY_PATTERNS) {
      if (pattern.test(this.text)) {
        this.parsingNotes.push(`Found difficulty: ${value}`)
        return value
      }
    }
    return 'medium' // Default difficulty
  }

  private extractMealType(): 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack' {
    for (const { pattern, value } of MEAL_TYPE_PATTERNS) {
      if (pattern.test(this.text)) {
        this.parsingNotes.push(`Found meal type: ${value}`)
        return value
      }
    }
    return 'dinner' // Default meal type
  }

  private calculateConfidence(): number {
    let confidence = 0.3 // Base confidence

    // Title confidence
    const title = this.extractTitle()
    if (title !== 'Untitled Recipe') {
      confidence += 0.1
    }

    // Ingredients confidence
    const ingredients = this.extractIngredients()
    if (ingredients.length >= 3) {
      confidence += 0.2
    } else if (ingredients.length >= 1) {
      confidence += 0.1
    }

    // Instructions confidence
    const instructions = this.extractInstructions()
    if (instructions.length >= 3) {
      confidence += 0.2
    } else if (instructions.length >= 1) {
      confidence += 0.1
    }

    // Time information confidence
    const prepTime = this.extractTime(this.text, 'prep')
    const cookTime = this.extractTime(this.text, 'cook')
    if (prepTime > 0 || cookTime > 0) {
      confidence += 0.1
    }

    // Serving information confidence
    if (this.extractServings() !== 4) {
      confidence += 0.05
    }

    return Math.min(confidence, 1.0)
  }

  public async parse(): Promise<ParsingResult> {
    try {
      // Try Ethos AI first if enabled
      if (this.useEthosAI) {
        const ethosResult = await this.tryEthosAIParsing()
        if (ethosResult && ethosResult.instructions.length > 0) {
          return {
            recipe: ethosResult,
            success: true,
            warnings: ethosResult.instructions.length < 3 ? ['Few instructions detected'] : undefined
          }
        }
      }

      // Fall back to local parsing
      const title = this.extractTitle()
      const ingredients = this.extractIngredients()
      const instructions = this.extractInstructions()
      const prepTime = this.extractTime(this.text, 'prep')
      const cookTime = this.extractTime(this.text, 'cook')
      const servings = this.extractServings()
      const difficulty = this.extractDifficulty()
      const mealType = this.extractMealType()
      const confidence = this.calculateConfidence()

      const recipe: ParsedRecipe = {
        title,
        ingredients,
        instructions,
        prep_time_minutes: prepTime,
        cook_time_minutes: cookTime,
        servings,
        difficulty,
        meal_type: mealType,
        confidence_score: confidence,
        parsing_notes: this.parsingNotes,
        provider: 'local'
      }

      const warnings: string[] = []
      const errors: string[] = []

      // Generate warnings
      if (ingredients.length === 0) {
        warnings.push('No ingredients were detected')
      }
      if (instructions.length === 0) {
        warnings.push('No instructions were detected')
      }
      if (confidence < 0.6) {
        warnings.push('Low confidence parsing - please review the extracted content')
      }

      // Generate errors
      if (title === 'Untitled Recipe') {
        errors.push('Could not extract recipe title')
      }

      return {
        recipe,
        success: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
        warnings: warnings.length > 0 ? warnings : undefined
      }
    } catch (error) {
      console.error('Recipe parsing error:', error)
      return {
        recipe: {
          title: 'Error Parsing Recipe',
          ingredients: [],
          instructions: [],
          confidence_score: 0,
          parsing_notes: ['Parsing failed due to an error'],
          provider: 'local'
        },
        success: false,
        errors: ['Failed to parse recipe: ' + (error instanceof Error ? error.message : 'Unknown error')]
      }
    }
  }
}

// Export a simple function for easy use
export async function parseRecipe(text: string, useEthosAI: boolean = false): Promise<ParsingResult> {
  const parser = new RecipeParser(text, useEthosAI)
  return parser.parse()
} 
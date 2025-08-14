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
}

export interface ParsingResult {
  recipe: ParsedRecipe
  success: boolean
  errors?: string[]
  warnings?: string[]
}

// Common ingredient patterns
const INGREDIENT_PATTERNS = [
  /^[\d\/\s]+(cup|cups|tbsp|tsp|oz|pound|pounds|g|kg|ml|l|clove|cloves|slice|slices|can|cans|package|packages|bunch|bunches|head|heads|stalk|stalks|sprig|sprigs|dash|pinch|to taste)/i,
  /^[\d\/\s]+(teaspoon|teaspoons|tablespoon|tablespoons|ounce|ounces|gram|grams|kilogram|kilograms|milliliter|milliliters|liter|liters)/i,
  /^[\d\/\s]+(large|medium|small|extra large|xl|lg|med|sm)\s+(egg|eggs|onion|onions|tomato|tomatoes|potato|potatoes|carrot|carrots|bell pepper|bell peppers)/i,
  /^[\d\/\s]+(fresh|dried|ground|whole|chopped|diced|minced|sliced|grated|shredded|crushed|softened|melted|room temperature)/i,
  /^[\d\/\s]+(salt|pepper|sugar|flour|oil|butter|milk|water|broth|stock|sauce|vinegar|lemon juice|lime juice|garlic|onion|herbs|spices)/i
]

// Common instruction patterns
const INSTRUCTION_PATTERNS = [
  /^(preheat|heat|warm|bring|boil|simmer|fry|sauté|bake|roast|grill|broil|steam|poach|blanch|caramelize|reduce|thicken|whisk|beat|mix|stir|fold|knead|roll|cut|chop|dice|mince|slice|grate|shred|crush|mash|purée|blend|process|strain|drain|rinse|pat dry|season|marinate|rest|cool|chill|freeze|thaw|serve|garnish|decorate)/i,
  /^(add|combine|mix|stir|whisk|beat|fold|knead|roll|cut|chop|dice|mince|slice|grate|shred|crush|mash|purée|blend|process|strain|drain|rinse|pat dry|season|marinate|rest|cool|chill|freeze|thaw|serve|garnish|decorate)/i,
  /^(until|while|when|after|before|during|meanwhile|meanwhile|then|next|finally|lastly|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)/i
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

  constructor(text: string) {
    this.text = this.cleanText(text)
    this.lines = this.text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    this.parsingNotes = []
  }

  private cleanText(text: string): string {
    return text
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
      .replace(/[^\w\s\n\-.,;:()\/°]/g, '') // Remove special characters but keep basic punctuation
      .trim()
  }

  private extractTitle(): string {
    // Look for the first line that could be a title
    for (let i = 0; i < Math.min(5, this.lines.length); i++) {
      const line = this.lines[i]
      
      // Skip common non-title patterns
      if (this.isCommonNonTitle(line)) continue
      
      // Check if line looks like a title
      if (this.looksLikeTitle(line)) {
        this.parsingNotes.push(`Title extracted from line ${i + 1}: "${line}"`)
        return line
      }
    }

    // Fallback: use first non-empty line
    const firstLine = this.lines.find(line => line.length > 0 && !this.isCommonNonTitle(line))
    if (firstLine) {
      this.parsingNotes.push(`Using first available line as title: "${firstLine}"`)
      return firstLine
    }

    this.parsingNotes.push('No suitable title found, using default')
    return 'Untitled Recipe'
  }

  private isCommonNonTitle(line: string): boolean {
    const nonTitlePatterns = [
      /^(ingredients|ingredient|directions|instructions|method|steps|preparation|serves|yield|makes|prep time|cook time|total time|difficulty|level|cuisine|type|category)/i,
      /^\d+\./, // Numbered lists
      /^[a-z]\./, // Lettered lists
      /^[-*•]/, // Bullet points
      /^\s*$/, // Empty lines
      /^(preheat|heat|add|mix|stir|bake|cook|serve)/i // Common instruction starters
    ]

    return nonTitlePatterns.some(pattern => pattern.test(line))
  }

  private looksLikeTitle(line: string): boolean {
    // Title characteristics
    const hasReasonableLength = line.length >= 3 && line.length <= 100
    const hasCapitalization = /[A-Z]/.test(line)
    const notAllCaps = !/^[A-Z\s]+$/.test(line)
    const notNumbered = !/^\d+\./.test(line)
    const notBulletPoint = !/^[-*•]/.test(line)
    
    return hasReasonableLength && hasCapitalization && notAllCaps && notNumbered && notBulletPoint
  }

  private extractIngredients(): string[] {
    const ingredients: string[] = []
    let inIngredientsSection = false
    let ingredientsStartIndex = -1

    // Find ingredients section
    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i].toLowerCase()
      
      if (line.includes('ingredient') && !line.includes('instruction')) {
        inIngredientsSection = true
        ingredientsStartIndex = i
        break
      }
    }

    // If no ingredients section found, look for common ingredient patterns
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
        
        // Check if line looks like an ingredient
        if (this.looksLikeIngredient(line)) {
          const cleanedIngredient = this.cleanIngredient(line)
          if (cleanedIngredient) {
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
           // Check for common ingredient words
           /(salt|pepper|sugar|flour|oil|butter|milk|water|egg|onion|garlic|tomato|cheese|meat|chicken|beef|pork|fish|vegetable|herb|spice)/i.test(line)
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

    // If no instructions section found, look for numbered steps
    if (instructionsStartIndex === -1) {
      for (let i = 0; i < this.lines.length; i++) {
        const line = this.lines[i]
        if (/^\d+\./.test(line) || this.looksLikeInstruction(line)) {
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
        if (/^\d+\./.test(line) || this.looksLikeNewInstruction(line)) {
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
    return 4 // Default
  }

  private extractDifficulty(): 'easy' | 'medium' | 'hard' {
    for (const { pattern, value } of DIFFICULTY_PATTERNS) {
      if (pattern.test(this.text)) {
        this.parsingNotes.push(`Detected difficulty: ${value}`)
        return value
      }
    }
    return 'medium' // Default
  }

  private extractMealType(): 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack' {
    for (const { pattern, value } of MEAL_TYPE_PATTERNS) {
      if (pattern.test(this.text)) {
        this.parsingNotes.push(`Detected meal type: ${value}`)
        return value
      }
    }
    return 'dinner' // Default
  }

  private calculateConfidence(): number {
    let confidence = 0.5 // Base confidence

    // Title confidence
    if (this.extractTitle() !== 'Untitled Recipe') {
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

  public parse(): ParsingResult {
    try {
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
        parsing_notes: this.parsingNotes
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
          parsing_notes: ['Parsing failed due to an error']
        },
        success: false,
        errors: ['Failed to parse recipe: ' + (error instanceof Error ? error.message : 'Unknown error')]
      }
    }
  }
}

// Export a simple function for easy use
export function parseRecipe(text: string): ParsingResult {
  const parser = new RecipeParser(text)
  return parser.parse()
} 
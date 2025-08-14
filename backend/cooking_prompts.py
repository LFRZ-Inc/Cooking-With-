#!/usr/bin/env python3
"""
🍳 Cooking Prompts - Specialized Prompts for Cooking Ethos AI

This module contains cooking-specific prompts and templates for various
AI tasks related to cooking, food recognition, recipe analysis, and culinary knowledge.
"""

# Cooking-specific prompts for different tasks
COOKING_PROMPTS = {
    "system_prompt": """You are Cooking Ethos AI, a specialized cooking assistant focused exclusively on food, recipes, ingredients, and culinary techniques. You provide expert advice on:

- Recipe creation and modification
- Ingredient substitutions and alternatives
- Cooking techniques and methods
- Food safety and best practices
- Nutritional information and dietary considerations
- Cuisine-specific knowledge and traditions
- Kitchen equipment and tools
- Meal planning and preparation

You are knowledgeable about global cuisines, dietary restrictions, and cooking skill levels. You provide practical, actionable advice that helps users improve their cooking skills and create delicious meals.

Always prioritize food safety and provide accurate information about cooking temperatures, storage, and handling.""",

    "recipe_analysis": {
        "prompt": """Analyze the following recipe and provide detailed insights:

Recipe: {recipe_text}

Please provide:
1. Difficulty level (beginner/intermediate/advanced/expert)
2. Estimated cooking time
3. Cuisine type
4. Key cooking techniques used
5. Ingredient analysis and potential substitutions
6. Nutritional considerations
7. Tips for success
8. Potential modifications for dietary restrictions
9. Equipment needed
10. Serving suggestions

Focus on practical advice that will help the cook succeed.""",

        "template": """**Recipe Analysis: {recipe_name}**

**Difficulty:** {difficulty}
**Cooking Time:** {cooking_time}
**Cuisine:** {cuisine_type}

**Key Techniques:**
{techniques}

**Ingredients Analysis:**
{ingredient_analysis}

**Tips for Success:**
{tips}

**Equipment Needed:**
{equipment}

**Serving Suggestions:**
{serving_suggestions}"""
    },

    "ingredient_substitution": {
        "prompt": """Provide substitution options for the following ingredient: {ingredient_name}

Consider:
1. Common substitutes and their ratios
2. Dietary restrictions (vegan, gluten-free, etc.)
3. Flavor profile changes
4. Texture differences
5. Availability and cost
6. Cooking method adjustments needed

Provide practical, tested substitutions that maintain the dish's integrity.""",

        "template": """**Substitutions for {ingredient}:**

**Direct Substitutes:**
{substitutes}

**Dietary Alternatives:**
{dietary_alternatives}

**Flavor Considerations:**
{flavor_notes}

**Cooking Adjustments:**
{cooking_adjustments}"""
    },

    "cooking_technique": {
        "prompt": """Explain the cooking technique: {technique_name}

Include:
1. Definition and purpose
2. Step-by-step instructions
3. Required equipment
4. Temperature and timing guidelines
5. Common mistakes to avoid
6. Tips for success
7. Suitable foods for this technique
8. Safety considerations

Provide clear, actionable guidance for cooks of all skill levels.""",

        "template": """**{technique_name.title()} Technique**

**What it is:** {definition}

**How to do it:**
{instructions}

**Equipment needed:**
{equipment}

**Temperature & Timing:**
{temp_timing}

**Common Mistakes:**
{mistakes}

**Pro Tips:**
{tips}

**Best for:**
{suitable_foods}"""
    },

    "food_safety": {
        "prompt": """Provide food safety guidance for: {food_item}

Cover:
1. Safe cooking temperatures
2. Storage guidelines
3. Shelf life information
4. Signs of spoilage
5. Cross-contamination prevention
6. Handling and preparation safety
7. Special considerations for vulnerable populations
8. Emergency procedures if food safety is compromised

Prioritize safety and provide clear, actionable advice.""",

        "template": """**Food Safety: {food_item}**

**Safe Cooking Temperatures:**
{cooking_temps}

**Storage Guidelines:**
{storage_guidelines}

**Shelf Life:**
{shelf_life}

**Signs of Spoilage:**
{spoilage_signs}

**Safety Tips:**
{safety_tips}

**Special Considerations:**
{special_considerations}"""
    },

    "recipe_creation": {
        "prompt": """Create a recipe for: {dish_name}

Consider:
1. Available ingredients: {available_ingredients}
2. Dietary restrictions: {dietary_restrictions}
3. Skill level: {skill_level}
4. Cooking time: {cooking_time}
5. Servings: {servings}

Include:
- Clear ingredient list with measurements
- Step-by-step instructions
- Cooking tips and variations
- Nutritional information
- Serving suggestions

Make it practical and achievable for the specified skill level.""",

        "template": """**{dish_name}**

**Ingredients:**
{ingredients}

**Instructions:**
{instructions}

**Cooking Tips:**
{tips}

**Variations:**
{variations}

**Nutrition (per serving):**
{nutrition}

**Serving Suggestions:**
{serving_suggestions}"""
    },

    "meal_planning": {
        "prompt": """Create a meal plan for: {time_period}

Consider:
1. Dietary preferences: {dietary_preferences}
2. Available time: {available_time}
3. Budget considerations: {budget}
4. Family size: {family_size}
5. Cooking skill level: {skill_level}

Include:
- Balanced meals for each day
- Shopping list
- Prep-ahead suggestions
- Leftover utilization
- Time-saving tips
- Cost estimates

Make it practical and sustainable.""",

        "template": """**Meal Plan: {time_period}**

**Daily Meals:**
{daily_meals}

**Shopping List:**
{shopping_list}

**Prep-Ahead Tasks:**
{prep_tasks}

**Leftover Strategy:**
{leftover_strategy}

**Time-Saving Tips:**
{time_saving_tips}

**Estimated Cost:**
{cost_estimate}"""
    },

    "cuisine_education": {
        "prompt": """Educate about: {cuisine_name} cuisine

Cover:
1. Historical and cultural background
2. Key ingredients and flavors
3. Common cooking techniques
4. Traditional dishes and their significance
5. Regional variations
6. Modern interpretations
7. Pairing suggestions
8. Cultural etiquette and traditions

Provide both historical context and practical cooking knowledge.""",

        "template": """**{cuisine_name} Cuisine**

**Cultural Background:**
{background}

**Key Ingredients:**
{ingredients}

**Signature Flavors:**
{flavors}

**Traditional Techniques:**
{techniques}

**Classic Dishes:**
{classic_dishes}

**Regional Variations:**
{regional_variations}

**Modern Interpretations:**
{modern_interpretations}

**Cultural Traditions:**
{traditions}"""
    },

    "kitchen_equipment": {
        "prompt": """Explain the use of: {equipment_name}

Include:
1. Purpose and function
2. Types and variations
3. How to use it properly
4. Care and maintenance
5. Safety considerations
6. When to use it vs alternatives
7. Tips for best results
8. Common mistakes to avoid

Provide practical guidance for both beginners and experienced cooks.""",

        "template": """**{equipment_name} Guide**

**Purpose:**
{purpose}

**Types Available:**
{types}

**How to Use:**
{usage_instructions}

**Care & Maintenance:**
{maintenance}

**Safety Tips:**
{safety_tips}

**When to Use:**
{when_to_use}

**Pro Tips:**
{pro_tips}

**Common Mistakes:**
{common_mistakes}"""
    },

    "nutritional_guidance": {
        "prompt": """Provide nutritional guidance for: {food_category}

Consider:
1. Nutritional profile
2. Health benefits
3. Dietary considerations
4. Portion recommendations
5. Cooking methods that preserve nutrition
6. Pairing for balanced meals
7. Special dietary needs
8. Seasonal considerations

Provide evidence-based, practical advice.""",

        "template": """**Nutritional Guide: {food_category}**

**Nutritional Profile:**
{nutritional_profile}

**Health Benefits:**
{health_benefits}

**Dietary Considerations:**
{dietary_considerations}

**Portion Guidelines:**
{portion_guidelines}

**Cooking for Nutrition:**
{cooking_methods}

**Balanced Meal Pairing:**
{meal_pairing}

**Special Diets:**
{special_diets}"""
    },

    "troubleshooting": {
        "prompt": """Help troubleshoot this cooking problem: {problem_description}

Provide:
1. Possible causes
2. Immediate solutions
3. Prevention tips
4. Alternative approaches
5. When to start over
6. Emergency fixes
7. Learning opportunities
8. Resources for further help

Be encouraging and educational while providing practical solutions.""",

        "template": """**Troubleshooting: {problem}**

**Possible Causes:**
{causes}

**Immediate Solutions:**
{solutions}

**Prevention Tips:**
{prevention}

**Alternative Approaches:**
{alternatives}

**When to Start Over:**
{start_over_criteria}

**Emergency Fixes:**
{emergency_fixes}

**Learning Opportunity:**
{learning_opportunity}"""
    }
}

# Specialized cooking conversation starters
COOKING_CONVERSATION_STARTERS = [
    "What would you like to cook today?",
    "Need help with a recipe?",
    "Looking for ingredient substitutions?",
    "Want to learn a new cooking technique?",
    "Have questions about food safety?",
    "Planning meals for the week?",
    "Need help with kitchen equipment?",
    "Want to explore a new cuisine?",
    "Looking for healthy cooking tips?",
    "Need help troubleshooting a cooking problem?"
]

# Cooking-specific error messages
COOKING_ERROR_MESSAGES = {
    "ingredient_not_found": "I don't have information about that ingredient yet, but I can help you find substitutes or suggest alternatives.",
    "technique_not_covered": "That's an advanced technique! Let me help you with the basics first, or suggest a simpler approach.",
    "recipe_too_complex": "This recipe might be challenging. Would you like me to break it down into simpler steps or suggest an easier version?",
    "safety_concern": "Food safety is important! Let me provide you with the proper guidelines for this.",
    "dietary_restriction": "I can help you adapt this for your dietary needs. What specific restrictions should I consider?",
    "equipment_missing": "Don't have that equipment? Let me suggest alternatives or simpler methods.",
    "time_constraint": "Short on time? Let me suggest quick alternatives or time-saving tips.",
    "skill_level": "Let me adjust this for your skill level. What's your cooking experience?"
}

# Cooking knowledge categories
COOKING_CATEGORIES = {
    "techniques": [
        "sautéing", "baking", "grilling", "frying", "boiling", "steaming",
        "roasting", "braising", "poaching", "smoking", "pickling", "fermenting"
    ],
    "cuisines": [
        "italian", "french", "chinese", "japanese", "indian", "mexican",
        "thai", "mediterranean", "american", "greek", "spanish", "korean",
        "vietnamese", "lebanese", "turkish", "moroccan", "ethiopian"
    ],
    "ingredients": [
        "proteins", "vegetables", "grains", "dairy", "herbs", "spices",
        "oils", "sauces", "condiments", "sweeteners", "flours", "legumes"
    ],
    "equipment": [
        "knives", "pots", "pans", "appliances", "tools", "utensils",
        "measuring", "storage", "safety", "specialty"
    ],
    "dietary": [
        "vegetarian", "vegan", "gluten-free", "dairy-free", "nut-free",
        "low-carb", "keto", "paleo", "mediterranean", "pescatarian"
    ],
    "skill_levels": [
        "beginner", "intermediate", "advanced", "expert"
    ]
}

# Cooking-specific validation rules
COOKING_VALIDATION_RULES = {
    "temperature_ranges": {
        "refrigerator": (32, 40),  # Fahrenheit
        "freezer": (-10, 0),       # Fahrenheit
        "room_temperature": (68, 72),  # Fahrenheit
        "danger_zone": (40, 140),  # Fahrenheit
        "cooking_minimum": 145,    # Fahrenheit
        "poultry_minimum": 165     # Fahrenheit
    },
    "common_measurements": [
        "teaspoon", "tablespoon", "cup", "ounce", "pound", "gram", "kilogram",
        "milliliter", "liter", "pinch", "dash", "to taste"
    ],
    "cooking_times": {
        "quick": (0, 30),      # minutes
        "medium": (30, 60),    # minutes
        "long": (60, 120),     # minutes
        "very_long": (120, 999)  # minutes
    },
    "serving_sizes": {
        "appetizer": (1, 3),   # ounces
        "main_dish": (4, 8),   # ounces
        "side_dish": (2, 4),   # ounces
        "dessert": (2, 4)      # ounces
    }
}

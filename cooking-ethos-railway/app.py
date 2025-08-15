#!/usr/bin/env python3
"""
🍳 Cooking Ethos AI - Railway Deployment
Specialized cooking AI assistant for Railway deployment
"""

import os
import json
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any

from flask import Flask, request, jsonify
from flask_cors import CORS

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Cooking knowledge base
COOKING_KNOWLEDGE = {
    "chicken": {
        "response": "To cook chicken breast properly, preheat your oven to 400°F (200°C). Season the chicken with salt, pepper, and your favorite herbs. Place it in a baking dish and cook for 20-25 minutes until the internal temperature reaches 165°F (74°C). Let it rest for 5 minutes before slicing.",
        "suggestions": ["How to make chicken marinade", "Chicken cooking techniques", "Safe cooking temperatures"]
    },
    "ground_beef": {
        "response": "Ground beef is incredibly versatile! Here are some great dishes you can make: 1) Classic hamburgers - form into patties and grill or pan-fry. 2) Spaghetti Bolognese - brown the beef, add tomato sauce and herbs. 3) Tacos - season with taco seasoning and serve with tortillas. 4) Meatballs - mix with breadcrumbs, egg, and herbs, then bake or simmer in sauce. 5) Shepherd's pie - layer with mashed potatoes and bake. Always cook ground beef to 160°F (71°C) for safety!",
        "suggestions": ["Ground beef recipes", "How to make burgers", "Taco seasoning", "Meatball recipes"]
    },
    "beef": {
        "response": "Ground beef is incredibly versatile! Here are some great dishes you can make: 1) Classic hamburgers - form into patties and grill or pan-fry. 2) Spaghetti Bolognese - brown the beef, add tomato sauce and herbs. 3) Tacos - season with taco seasoning and serve with tortillas. 4) Meatballs - mix with breadcrumbs, egg, and herbs, then bake or simmer in sauce. 5) Shepherd's pie - layer with mashed potatoes and bake. Always cook ground beef to 160°F (71°C) for safety!",
        "suggestions": ["Ground beef recipes", "How to make burgers", "Taco seasoning", "Meatball recipes"]
    },
    "pasta": {
        "response": "To make pasta, bring a large pot of salted water to a boil. Add your pasta and cook according to package directions (usually 8-12 minutes). Drain and serve with your favorite sauce. Remember: the water should taste like seawater for proper seasoning!",
        "suggestions": ["Pasta sauce recipes", "Al dente cooking tips", "Pasta types and uses"]
    },
    "substitute": {
        "response": "Here are some common cooking substitutions: Butter can be replaced with olive oil, coconut oil, or applesauce in baking. Eggs can be substituted with flax seeds, chia seeds, or commercial egg replacers. Milk can be replaced with almond milk, soy milk, or oat milk.",
        "suggestions": ["Baking substitutions", "Dairy alternatives", "Gluten-free options"]
    },
    "temperature": {
        "response": "Safe cooking temperatures: Chicken and turkey (165°F/74°C), Ground beef (160°F/71°C), Fish (145°F/63°C), Pork (145°F/63°C), Beef steaks (145°F/63°C for medium-rare). Always use a food thermometer for accuracy!",
        "suggestions": ["Food safety guidelines", "Cooking temperature charts", "Kitchen safety tips"]
    },
    "knife": {
        "response": "Proper knife skills are essential for cooking. Hold the knife with your index finger and thumb on the blade, other fingers wrapped around the handle. Use a rocking motion for chopping, and always keep your fingers curled under to avoid cuts. Keep your knives sharp - a dull knife is more dangerous than a sharp one!",
        "suggestions": ["Basic knife cuts", "Knife maintenance", "Kitchen safety"]
    },
    "seasoning": {
        "response": "Seasoning is key to great cooking! Salt enhances flavors, pepper adds warmth, and herbs bring freshness. Season in layers - a little salt while cooking, then adjust at the end. Remember: you can always add more, but you can't take it away!",
        "suggestions": ["Herb and spice guide", "Seasoning techniques", "Flavor pairing"]
    },
    "baking": {
        "response": "Baking is a science! Measure ingredients precisely, preheat your oven, and don't overmix. Room temperature ingredients work best for most recipes. Always check doneness with a toothpick or thermometer.",
        "suggestions": ["Baking basics", "Common baking mistakes", "Baking substitutions"]
    },
    "meal_planning": {
        "response": "Meal planning saves time and money! Plan your meals for the week, make a shopping list, and prep ingredients in advance. Consider batch cooking and freezing portions for busy days.",
        "suggestions": ["Weekly meal planning", "Grocery shopping tips", "Meal prep ideas"]
    }
}

# Ingredient database
INGREDIENT_DATABASE = {
    "chicken": {
        "name": "Chicken",
        "description": "Versatile protein source commonly used in cooking",
        "cooking_methods": ["bake", "grill", "pan-fry", "roast", "poach", "braise"],
        "substitutions": ["turkey", "tofu", "tempeh", "seitan", "fish"],
        "nutrition": "High protein, low fat, good source of B vitamins",
        "storage": "Refrigerate at 40°F or below, use within 2-3 days",
        "tips": ["Always cook to 165°F internal temperature", "Let rest for 5-10 minutes after cooking", "Use different cuts for different cooking methods"]
    },
    "tomato": {
        "name": "Tomato",
        "description": "Fruit commonly used as a vegetable in cooking",
        "cooking_methods": ["raw", "cook", "roast", "sauce", "soup", "salad"],
        "substitutions": ["bell peppers", "mushrooms", "zucchini", "eggplant"],
        "nutrition": "Rich in lycopene, vitamin C, and antioxidants",
        "storage": "Store at room temperature until ripe, then refrigerate",
        "tips": ["Remove seeds for less acidity", "Score an X before blanching", "Use different varieties for different purposes"]
    },
    "onion": {
        "name": "Onion",
        "description": "Essential aromatic vegetable used in most cuisines",
        "cooking_methods": ["sauté", "caramelize", "roast", "raw", "pickle"],
        "substitutions": ["shallots", "leeks", "scallions", "garlic"],
        "nutrition": "Good source of vitamin C, fiber, and antioxidants",
        "storage": "Store in cool, dry place away from potatoes",
        "tips": ["Chill before cutting to reduce tears", "Use different types for different flavors", "Caramelize slowly for sweetness"]
    },
    "garlic": {
        "name": "Garlic",
        "description": "Pungent bulb used for flavoring in many cuisines",
        "cooking_methods": ["mince", "roast", "sauté", "raw", "pickle"],
        "substitutions": ["garlic powder", "shallots", "onion", "chives"],
        "nutrition": "Contains allicin, known for health benefits",
        "storage": "Store in cool, dry place with good air circulation",
        "tips": ["Remove green sprout for milder flavor", "Crush before mincing for more flavor", "Don't burn - becomes bitter"]
    },
    "butter": {
        "name": "Butter",
        "description": "Dairy fat used for cooking, baking, and flavoring",
        "cooking_methods": ["melt", "cream", "clarify", "brown", "spread"],
        "substitutions": ["olive oil", "coconut oil", "applesauce", "avocado"],
        "nutrition": "High in saturated fat, contains vitamins A, D, E, K",
        "storage": "Refrigerate, can be frozen for longer storage",
        "tips": ["Use room temperature for baking", "Clarify for higher smoke point", "Brown for nutty flavor"]
    },
    "eggs": {
        "name": "Eggs",
        "description": "Versatile protein source used in cooking and baking",
        "cooking_methods": ["scramble", "fry", "boil", "poach", "bake"],
        "substitutions": ["flax seeds", "chia seeds", "banana", "applesauce", "commercial egg replacers"],
        "nutrition": "Complete protein, vitamins B12, D, and choline",
        "storage": "Refrigerate in original carton",
        "tips": ["Room temperature eggs work better for baking", "Fresh eggs are harder to peel when boiled", "Check freshness with water test"]
    },
    "milk": {
        "name": "Milk",
        "description": "Dairy liquid used in cooking, baking, and beverages",
        "cooking_methods": ["drink", "cook", "bake", "ferment", "froth"],
        "substitutions": ["almond milk", "soy milk", "oat milk", "coconut milk", "water"],
        "nutrition": "Good source of calcium, protein, and vitamin D",
        "storage": "Refrigerate, use by expiration date",
        "tips": ["Scald milk for better yeast activation", "Use whole milk for richer flavor", "Don't boil - can curdle"]
    },
    "flour": {
        "name": "Flour",
        "description": "Ground grain powder used in baking and cooking",
        "cooking_methods": ["bake", "thicken", "coat", "dust"],
        "substitutions": ["almond flour", "coconut flour", "oat flour", "gluten-free blends"],
        "nutrition": "Carbohydrates, some protein, fortified with vitamins",
        "storage": "Store in cool, dry place in airtight container",
        "tips": ["Sift for lighter baked goods", "Measure by weight for accuracy", "Different types for different purposes"]
    },
    "sugar": {
        "name": "Sugar",
        "description": "Sweet crystalline substance used in cooking and baking",
        "cooking_methods": ["dissolve", "caramelize", "cream", "sprinkle"],
        "substitutions": ["honey", "maple syrup", "agave", "stevia", "monk fruit"],
        "nutrition": "Pure carbohydrate, no nutrients",
        "storage": "Store in cool, dry place in airtight container",
        "tips": ["Different types for different purposes", "Caramelize carefully - burns easily", "Cream with butter for light texture"]
    },
    "salt": {
        "name": "Salt",
        "description": "Essential mineral used for seasoning and preservation",
        "cooking_methods": ["season", "preserve", "brine", "cure"],
        "substitutions": ["soy sauce", "miso", "anchovies", "capers"],
        "nutrition": "Sodium chloride, essential for body function",
        "storage": "Store in cool, dry place",
        "tips": ["Season in layers", "Different types have different flavors", "Essential for bringing out flavors"]
    },
    "ground_beef": {
        "name": "Ground Beef",
        "description": "Minced beef meat used in various dishes from burgers to pasta sauces",
        "cooking_methods": ["pan-fry", "grill", "bake", "simmer", "stir-fry"],
        "substitutions": ["ground turkey", "ground chicken", "ground pork", "plant-based crumbles", "lentils"],
        "nutrition": "Good source of protein, iron, and B vitamins",
        "storage": "Refrigerate and use within 2 days, or freeze for up to 4 months",
        "tips": ["Cook to 160°F for safety", "Break up while cooking for even browning", "Drain fat after cooking for healthier dishes"]
    }
}

# Cooking tips database
COOKING_TIPS = {
    "general": [
        {
            "title": "Mise en Place",
            "tip": "Always prep all your ingredients before starting to cook. This French term means 'everything in its place' and will make cooking much smoother.",
            "category": "preparation",
            "difficulty": "beginner"
        },
        {
            "title": "Season in Layers",
            "tip": "Add salt and seasoning throughout the cooking process, not just at the end. This builds flavor depth.",
            "category": "seasoning",
            "difficulty": "beginner"
        },
        {
            "title": "Taste as You Go",
            "tip": "Always taste your food while cooking and adjust seasoning accordingly. You can always add more, but you can't take it away.",
            "category": "seasoning",
            "difficulty": "beginner"
        },
        {
            "title": "Keep Knives Sharp",
            "tip": "A sharp knife is safer than a dull one. Sharp knives require less force and are less likely to slip.",
            "category": "safety",
            "difficulty": "beginner"
        },
        {
            "title": "Read Recipes Completely",
            "tip": "Read through the entire recipe before starting. This helps you understand the process and avoid surprises.",
            "category": "preparation",
            "difficulty": "beginner"
        }
    ],
    "baking": [
        {
            "title": "Room Temperature Ingredients",
            "tip": "Use room temperature eggs, butter, and milk for better mixing and consistent results in baked goods.",
            "category": "baking",
            "difficulty": "beginner"
        },
        {
            "title": "Don't Overmix",
            "tip": "Overmixing batter creates tough baked goods. Mix just until ingredients are combined.",
            "category": "baking",
            "difficulty": "intermediate"
        },
        {
            "title": "Preheat Your Oven",
            "tip": "Always preheat your oven for at least 10-15 minutes before baking for even cooking.",
            "category": "baking",
            "difficulty": "beginner"
        },
        {
            "title": "Measure Precisely",
            "tip": "Baking is a science. Use a kitchen scale for accurate measurements, especially for flour.",
            "category": "baking",
            "difficulty": "beginner"
        },
        {
            "title": "Check Doneness",
            "tip": "Use a toothpick or cake tester to check if baked goods are done. It should come out clean or with a few moist crumbs.",
            "category": "baking",
            "difficulty": "beginner"
        }
    ],
    "safety": [
        {
            "title": "Wash Hands Frequently",
            "tip": "Wash your hands with warm, soapy water for at least 20 seconds before, during, and after cooking.",
            "category": "safety",
            "difficulty": "beginner"
        },
        {
            "title": "Separate Cutting Boards",
            "tip": "Use separate cutting boards for raw meat, poultry, seafood, and vegetables to prevent cross-contamination.",
            "category": "safety",
            "difficulty": "beginner"
        },
        {
            "title": "Safe Temperatures",
            "tip": "Use a food thermometer to ensure meat reaches safe internal temperatures: Chicken 165°F, Ground beef 160°F, Fish 145°F.",
            "category": "safety",
            "difficulty": "beginner"
        },
        {
            "title": "Temperature Danger Zone",
            "tip": "Keep hot foods hot (above 140°F) and cold foods cold (below 40°F). Bacteria grow rapidly between 40-140°F.",
            "category": "safety",
            "difficulty": "beginner"
        },
        {
            "title": "Clean as You Go",
            "tip": "Clean surfaces and utensils that come in contact with raw meat immediately to prevent contamination.",
            "category": "safety",
            "difficulty": "beginner"
        }
    ],
    "techniques": [
        {
            "title": "Proper Knife Grip",
            "tip": "Hold the knife with your index finger and thumb on the blade, other fingers wrapped around the handle for better control.",
            "category": "techniques",
            "difficulty": "beginner"
        },
        {
            "title": "Claw Grip for Cutting",
            "tip": "Use the claw grip when cutting - curl your fingers under and use your knuckles as a guide for the knife.",
            "category": "techniques",
            "difficulty": "beginner"
        },
        {
            "title": "Deglazing",
            "tip": "After searing meat, add liquid (wine, broth) to the hot pan to release flavorful browned bits stuck to the bottom.",
            "category": "techniques",
            "difficulty": "intermediate"
        },
        {
            "title": "Resting Meat",
            "tip": "Let cooked meat rest for 5-10 minutes before cutting. This allows juices to redistribute and prevents them from running out.",
            "category": "techniques",
            "difficulty": "beginner"
        },
        {
            "title": "Blanching",
            "tip": "Quickly cook vegetables in boiling water, then shock in ice water to stop cooking and preserve color and texture.",
            "category": "techniques",
            "difficulty": "intermediate"
        }
    ],
    "seasoning": [
        {
            "title": "Salt Enhances Flavor",
            "tip": "Salt doesn't just make food salty - it enhances and brings out other flavors in your dish.",
            "category": "seasoning",
            "difficulty": "beginner"
        },
        {
            "title": "Fresh Herbs Last",
            "tip": "Add fresh herbs at the end of cooking to preserve their delicate flavor and bright color.",
            "category": "seasoning",
            "difficulty": "beginner"
        },
        {
            "title": "Toast Spices",
            "tip": "Toast whole spices in a dry pan before grinding to release their essential oils and enhance flavor.",
            "category": "seasoning",
            "difficulty": "intermediate"
        },
        {
            "title": "Balance Flavors",
            "tip": "Balance sweet, sour, salty, bitter, and umami flavors for a well-rounded dish.",
            "category": "seasoning",
            "difficulty": "intermediate"
        },
        {
            "title": "Acid Brightens",
            "tip": "A squeeze of lemon juice or splash of vinegar can brighten and balance rich or heavy dishes.",
            "category": "seasoning",
            "difficulty": "beginner"
        }
    ]
}

def generate_cooking_response(message: str, source: str = "cooking_with") -> Dict[str, Any]:
    """Generate cooking-focused response based on message content and source"""
    message_lower = message.lower()
    
    # Default response
    response = "I'm your specialized cooking assistant! I can help with recipes, cooking techniques, ingredient substitutions, food safety, and more. What would you like to know about cooking?"
    suggestions = ["How to cook chicken breast", "Pasta cooking tips", "Ingredient substitutions", "Safe cooking temperatures"]
    confidence = 0.85
    
    # ===== INGREDIENT COMBINATION PATTERNS =====
    # Handle "what can i do with" patterns
    if any(phrase in message_lower for phrase in [
        "what can i do with", "what to make with", "recipes with", "what can i make with",
        "what should i cook with", "what can i cook with", "ideas for", "what to do with",
        "how to use", "what to make", "what can i cook", "what should i make",
        "i have", "i got", "i bought", "i need ideas for", "help me use"
    ]):
        common_ingredients = list(INGREDIENT_DATABASE.keys())
        found_ingredients = []
        for ing in common_ingredients:
            if ing in message_lower:
                found_ingredients.append(ing)
        
        if found_ingredients:
            if len(found_ingredients) == 1:
                # Single ingredient
                ingredient_info = INGREDIENT_DATABASE[found_ingredients[0]]
                response = f"With {ingredient_info['name']}, you can: {', '.join(ingredient_info['cooking_methods'])}. {ingredient_info['tips'][0]}"
                suggestions = [
                    f"Recipes with {ingredient_info['name']}",
                    f"Substitutes for {ingredient_info['name']}",
                    f"Storage tips for {ingredient_info['name']}"
                ]
            else:
                # Multiple ingredients - suggest recipes
                ingredient_names = [INGREDIENT_DATABASE[ing]['name'] for ing in found_ingredients]
                response = f"Great combination! With {', '.join(ingredient_names)}, you can make: pancakes, French toast, custard, ice cream, cake, cookies, bread pudding, or flan. These ingredients are perfect for baking and desserts!"
                suggestions = ["Pancake recipes", "French toast ideas", "Custard recipes", "Baking tips"]
        else:
            response = "I can help you find recipes and cooking ideas! What specific ingredients are you working with?"
            suggestions = ["Recipe search", "Ingredient substitutions", "Cooking techniques"]
    
    # ===== COOKING TECHNIQUE PATTERNS =====
    # Chicken cooking patterns
    elif any(phrase in message_lower for phrase in [
        "chicken", "chicken breast", "chicken thigh", "chicken wing"
    ]) and any(phrase in message_lower for phrase in [
        "cook", "make", "prepare", "how to", "way to", "best way", "properly", "right way",
        "cooking", "preparing", "making", "recipe", "method", "technique"
    ]):
        knowledge = COOKING_KNOWLEDGE["chicken"]
        response = knowledge["response"]
        suggestions = knowledge["suggestions"]
    
    # Ground beef patterns
    elif any(phrase in message_lower for phrase in [
        "ground beef", "ground_beef", "beef", "hamburger meat", "minced beef"
    ]) and any(phrase in message_lower for phrase in [
        "dish", "recipe", "good", "make", "cook", "prepare", "what to", "ideas", "meal"
    ]):
        knowledge = COOKING_KNOWLEDGE["ground_beef"]
        response = knowledge["response"]
        suggestions = knowledge["suggestions"]
    
    # Pasta patterns
    elif "pasta" in message_lower and any(phrase in message_lower for phrase in [
        "make", "cook", "prepare", "how to", "way to", "best way", "properly", "al dente",
        "cooking", "preparing", "making", "recipe", "method", "technique"
    ]):
        knowledge = COOKING_KNOWLEDGE["pasta"]
        response = knowledge["response"]
        suggestions = knowledge["suggestions"]
    
    # ===== SUBSTITUTION PATTERNS =====
    elif any(phrase in message_lower for phrase in [
        "substitute", "alternative", "replace", "instead of", "don't have", "out of",
        "substitution", "replacement", "alternative to", "what can i use", "can i use",
        "what to use", "what else", "other options", "options for"
    ]):
        knowledge = COOKING_KNOWLEDGE["substitute"]
        response = knowledge["response"]
        suggestions = knowledge["suggestions"]
    
    # ===== SAFETY PATTERNS =====
    elif any(phrase in message_lower for phrase in [
        "temperature", "safe", "safety", "cook to", "internal temp", "how hot",
        "food safety", "safe to eat", "done", "cooked enough", "undercooked",
        "overcooked", "thermometer", "food poisoning", "bacteria"
    ]):
        knowledge = COOKING_KNOWLEDGE["temperature"]
        response = knowledge["response"]
        suggestions = knowledge["suggestions"]
    
    # ===== KNIFE SKILLS PATTERNS =====
    elif any(phrase in message_lower for phrase in [
        "knife", "cut", "chop", "slice", "dice", "mince", "julienne", "knife skills",
        "cutting", "chopping", "slicing", "how to cut", "proper way to", "knife technique",
        "knife safety", "sharp knife", "dull knife", "knife grip", "knife hold"
    ]):
        knowledge = COOKING_KNOWLEDGE["knife"]
        response = knowledge["response"]
        suggestions = knowledge["suggestions"]
    
    # ===== SEASONING PATTERNS =====
    elif any(phrase in message_lower for phrase in [
        "season", "salt", "spice", "herb", "flavor", "taste", "seasoning", "spices",
        "herbs", "flavoring", "how to season", "when to salt", "salt timing",
        "spice blend", "herb mix", "flavor profile", "taste balance", "seasoning tips"
    ]):
        knowledge = COOKING_KNOWLEDGE["seasoning"]
        response = knowledge["response"]
        suggestions = knowledge["suggestions"]
    
    # ===== BAKING PATTERNS =====
    elif any(phrase in message_lower for phrase in [
        "bake", "baking", "oven", "baked goods", "cake", "bread", "cookie", "pastry",
        "baking tips", "baking mistakes", "baking science", "baking temperature",
        "baking time", "baking ingredients", "baking technique", "baking method"
    ]):
        knowledge = COOKING_KNOWLEDGE["baking"]
        response = knowledge["response"]
        suggestions = knowledge["suggestions"]
    
    # ===== MEAL PLANNING PATTERNS =====
    elif any(phrase in message_lower for phrase in [
        "meal plan", "meal planning", "weekly meals", "dinner ideas", "lunch ideas",
        "breakfast ideas", "meal prep", "food prep", "weekly menu", "meal schedule",
        "planning meals", "organizing meals", "meal ideas", "what to cook this week"
    ]):
        knowledge = COOKING_KNOWLEDGE["meal_planning"]
        response = knowledge["response"]
        suggestions = knowledge["suggestions"]
    
    # ===== TIPS AND ADVICE PATTERNS =====
    elif any(phrase in message_lower for phrase in [
        "tip", "advice", "help", "suggestion", "recommendation", "trick", "hack",
        "pro tip", "chef tip", "cooking tip", "kitchen tip", "helpful tip",
        "useful tip", "good tip", "best practice", "cooking advice", "kitchen advice"
    ]):
        # Get cooking tips
        relevant_tips = []
        for category, tips in COOKING_TIPS.items():
            for tip in tips:
                if (tip["title"].lower() in message_lower or 
                    tip["tip"].lower() in message_lower or
                    tip["category"].lower() in message_lower):
                    relevant_tips.append(tip)
        
        if relevant_tips:
            response = f"Here are some helpful cooking tips for you:\n\n" + "\n\n".join([
                f"• {tip['title']}: {tip['tip']}" for tip in relevant_tips[:3]
            ])
            suggestions = ["Baking tips", "Kitchen safety", "Cooking techniques", "Seasoning advice"]
        else:
            response = "I don't have specific tips for that, but here are some general cooking tips that are always helpful."
            suggestions = ["Baking tips", "Kitchen safety", "Cooking techniques", "Seasoning advice"]
    
    # ===== INGREDIENT-SPECIFIC PATTERNS =====
    elif any(phrase in message_lower for phrase in [
        "ingredient", "substitute", "cook", "prepare", "use", "how to use", "what to do with"
    ]):
        # Check for ingredient-specific questions
        common_ingredients = list(INGREDIENT_DATABASE.keys())
        found_ingredient = None
        for ing in common_ingredients:
            if ing in message_lower:
                found_ingredient = ing
                break
        
        if found_ingredient:
            ingredient_info = INGREDIENT_DATABASE[found_ingredient]
            if any(phrase in message_lower for phrase in ["substitute", "replace", "instead", "alternative"]):
                response = f"For {ingredient_info['name']}, you can substitute with: {', '.join(ingredient_info['substitutions'])}. The best choice depends on your recipe and dietary needs."
                suggestions = ["How to use substitutes", "Recipe modifications", "Dietary restrictions"]
            elif any(phrase in message_lower for phrase in ["cook", "method", "prepare", "make", "how to"]):
                response = f"{ingredient_info['name']} can be cooked using these methods: {', '.join(ingredient_info['cooking_methods'])}. {ingredient_info['tips'][0]}"
                suggestions = ["Cooking techniques", "Recipe ideas", "Kitchen tips"]
            elif any(phrase in message_lower for phrase in ["store", "keep", "save", "preserve", "refrigerate"]):
                response = f"To store {ingredient_info['name']}: {ingredient_info['storage']}"
                suggestions = ["Food storage tips", "Kitchen organization", "Food safety"]
            else:
                response = f"{ingredient_info['name']}: {ingredient_info['description']}. {ingredient_info['tips'][0]}"
                suggestions = [
                    f"How to cook {ingredient_info['name']}",
                    f"Substitutes for {ingredient_info['name']}",
                    f"Storage tips for {ingredient_info['name']}"
                ]
    
    # ===== GENERAL COOKING QUESTIONS =====
    elif any(phrase in message_lower for phrase in [
        "how do i", "how to", "what's the best way", "what's the right way", "proper way",
        "correct way", "best method", "easiest way", "quick way", "simple way",
        "step by step", "instructions", "guide", "tutorial", "help me"
    ]):
        # Check for specific cooking topics in the question
        if any(phrase in message_lower for phrase in ["chicken", "meat", "beef", "pork", "fish"]):
            knowledge = COOKING_KNOWLEDGE["chicken"]
            response = knowledge["response"]
            suggestions = knowledge["suggestions"]
        elif any(phrase in message_lower for phrase in ["pasta", "noodle", "spaghetti"]):
            knowledge = COOKING_KNOWLEDGE["pasta"]
            response = knowledge["response"]
            suggestions = knowledge["suggestions"]
        elif any(phrase in message_lower for phrase in ["bake", "cake", "bread", "cookie"]):
            knowledge = COOKING_KNOWLEDGE["baking"]
            response = knowledge["response"]
            suggestions = knowledge["suggestions"]
        else:
            # Generic cooking help
            response = "I'd be happy to help you with cooking! Could you be more specific about what you'd like to learn? For example, are you looking for help with a particular ingredient, cooking technique, or recipe?"
            suggestions = ["Cooking basics", "Ingredient guides", "Recipe help", "Kitchen tips"]
    
    # ===== RECIPE HELP PATTERNS =====
    elif any(phrase in message_lower for phrase in [
        "recipe", "dish", "meal", "food", "cooking", "preparing", "making", "cook",
        "prepare", "make", "create", "whip up", "throw together", "put together"
    ]):
        # Check for specific recipe types
        if any(phrase in message_lower for phrase in ["breakfast", "pancake", "waffle", "egg", "bacon"]):
            response = "For breakfast recipes, you can make pancakes, waffles, omelets, French toast, or breakfast burritos. What specific breakfast dish are you interested in?"
            suggestions = ["Pancake recipes", "Egg cooking tips", "Breakfast ideas", "Quick breakfast"]
        elif any(phrase in message_lower for phrase in ["dinner", "main course", "entree", "meal"]):
            response = "For dinner recipes, you can make pasta dishes, grilled meats, stir-fries, soups, or casseroles. What type of cuisine or main ingredient are you thinking of?"
            suggestions = ["Pasta recipes", "Grilled chicken", "Stir-fry ideas", "Soup recipes"]
        elif any(phrase in message_lower for phrase in ["dessert", "sweet", "cake", "cookie", "pie"]):
            response = "For dessert recipes, you can make cakes, cookies, pies, ice cream, or puddings. What type of dessert are you craving?"
            suggestions = ["Chocolate cake", "Sugar cookies", "Apple pie", "Ice cream"]
        else:
            response = "I can help you with all kinds of recipes! What type of dish are you looking to make? Breakfast, lunch, dinner, or dessert?"
            suggestions = ["Breakfast recipes", "Dinner ideas", "Dessert recipes", "Quick meals"]
    
    # ===== KITCHEN EQUIPMENT PATTERNS =====
    elif any(phrase in message_lower for phrase in [
        "pan", "pot", "utensil", "tool", "equipment", "appliance", "mixer", "blender",
        "food processor", "oven", "stove", "grill", "microwave", "slow cooker",
        "instant pot", "air fryer", "toaster", "coffee maker", "kitchen gadget"
    ]):
        response = "Kitchen equipment can make cooking much easier! What specific tool or appliance are you asking about? I can help with proper usage, maintenance, and cooking techniques for various kitchen equipment."
        suggestions = ["Pan types and uses", "Kitchen tool guide", "Appliance tips", "Equipment maintenance"]
    
    # ===== TIME AND EFFICIENCY PATTERNS =====
    elif any(phrase in message_lower for phrase in [
        "quick", "fast", "easy", "simple", "quick meal", "fast food", "easy recipe",
        "simple dish", "time saving", "efficient", "speedy", "hurry", "rush",
        "30 minutes", "15 minutes", "one pot", "one pan", "minimal effort"
    ]):
        response = "I can help you with quick and easy recipes! Here are some time-saving cooking tips: 1) Prep ingredients in advance, 2) Use one-pot meals, 3) Choose simple recipes with few ingredients, 4) Use kitchen shortcuts like pre-cut vegetables."
        suggestions = ["Quick dinner ideas", "One-pot meals", "30-minute recipes", "Easy cooking tips"]
    
    # ===== DIETARY RESTRICTIONS PATTERNS =====
    elif any(phrase in message_lower for phrase in [
        "vegetarian", "vegan", "gluten free", "dairy free", "keto", "paleo", "low carb",
        "healthy", "diet", "allergy", "intolerance", "restriction", "dietary",
        "plant based", "meatless", "no dairy", "no gluten", "low sugar"
    ]):
        response = "I can help you with dietary restrictions and special diets! There are many delicious alternatives and substitutions available. What specific dietary need are you working with?"
        suggestions = ["Vegetarian recipes", "Gluten-free baking", "Dairy alternatives", "Healthy cooking"]
    
    # ===== COOKING PROBLEMS PATTERNS =====
    elif any(phrase in message_lower for phrase in [
        "problem", "issue", "trouble", "difficulty", "not working", "failed", "burned",
        "overcooked", "undercooked", "stuck", "mess", "disaster", "ruined", "wrong",
        "mistake", "error", "fix", "help", "what went wrong", "why didn't"
    ]):
        response = "Don't worry, cooking problems happen to everyone! I can help you troubleshoot. What specific issue are you having? Common problems include overcooking, undercooking, burning, or texture issues."
        suggestions = ["Cooking troubleshooting", "Common mistakes", "Kitchen disasters", "Cooking fixes"]
    
    # ===== SEASONAL AND OCCASION PATTERNS =====
    elif any(phrase in message_lower for phrase in [
        "holiday", "party", "celebration", "special occasion", "birthday", "anniversary",
        "thanksgiving", "christmas", "easter", "halloween", "valentine", "summer",
        "winter", "spring", "fall", "seasonal", "festive", "entertaining"
    ]):
        response = "Special occasions call for special recipes! I can help you plan holiday meals, party food, or seasonal dishes. What type of celebration or season are you cooking for?"
        suggestions = ["Holiday recipes", "Party food ideas", "Seasonal cooking", "Entertaining tips"]
    
    # If source is "cooking_with", ensure we stay focused on cooking
    if source == "cooking_with":
        # Add cooking context to responses
        if "I'm your specialized cooking assistant" in response:
            response = "🍳 I'm your specialized cooking assistant! I can help with recipes, cooking techniques, ingredient substitutions, food safety, and more. What would you like to know about cooking?"
    
    return {
        "response": response,
        "suggestions": suggestions,
        "confidence": confidence,
        "timestamp": datetime.now().isoformat(),
        "source": source,
        "mode": "cooking_specialist"
    }

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "Cooking Ethos AI",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "mode": "cooking_specialist"
    })

@app.route('/api/cooking/chat', methods=['POST'])
def cooking_chat():
    """Handle cooking-related chat messages"""
    try:
        data = request.get_json()
        message = data.get('message', '')
        source = data.get('source', 'cooking_with')  # Default to cooking_with
        context = data.get('context', {})
        user_preferences = data.get('user_preferences', {})
        
        if not message:
            return jsonify({"error": "Message is required"}), 400
        
        # Generate cooking-focused response
        response_data = generate_cooking_response(message, source)
        
        return jsonify({
            "success": True,
            **response_data
        })
        
    except Exception as e:
        logger.error(f"Error in cooking chat: {str(e)}")
        return jsonify({"error": "Error processing cooking chat request"}), 500

@app.route('/api/cooking/ingredients', methods=['GET'])
def get_ingredients():
    """Get ingredient information"""
    try:
        ingredient = request.args.get('ingredient')
        ingredient_type = request.args.get('type', 'all')
        
        if ingredient:
            ingredient_info = INGREDIENT_DATABASE.get(ingredient.lower())
            if not ingredient_info:
                return jsonify({"error": "Ingredient not found"}), 404
            
            return jsonify({
                "success": True,
                "ingredient": ingredient_info
            })
        
        # Return all ingredients
        ingredients = [{"key": key, **value} for key, value in INGREDIENT_DATABASE.items()]
        return jsonify({
            "success": True,
            "ingredients": ingredients,
            "total": len(ingredients)
        })
        
    except Exception as e:
        logger.error(f"Error getting ingredients: {str(e)}")
        return jsonify({"error": "Error retrieving ingredient information"}), 500

@app.route('/api/cooking/ingredients', methods=['POST'])
def query_ingredient():
    """Query ingredient details"""
    try:
        data = request.get_json()
        ingredient = data.get('ingredient')
        query = data.get('query', '')
        
        if not ingredient:
            return jsonify({"error": "Ingredient is required"}), 400
        
        ingredient_info = INGREDIENT_DATABASE.get(ingredient.lower())
        
        if not ingredient_info:
            return jsonify({
                "success": True,
                "response": f"I don't have specific information about {ingredient}, but I can help you with general cooking questions about it. What would you like to know?",
                "suggestions": [
                    "How to cook common ingredients",
                    "Ingredient substitutions",
                    "Food safety guidelines"
                ]
            })
        
        # Generate response based on query type
        if "substitute" in query.lower() or "replace" in query.lower():
            response = f"For {ingredient_info['name']}, you can substitute with: {', '.join(ingredient_info['substitutions'])}. The best choice depends on your recipe and dietary needs."
            suggestions = ["How to use substitutes", "Recipe modifications", "Dietary restrictions"]
        elif "cook" in query.lower() or "method" in query.lower():
            response = f"{ingredient_info['name']} can be cooked using these methods: {', '.join(ingredient_info['cooking_methods'])}. {ingredient_info['tips'][0]}"
            suggestions = ["Cooking techniques", "Recipe ideas", "Kitchen tips"]
        elif "store" in query.lower() or "keep" in query.lower():
            response = f"To store {ingredient_info['name']}: {ingredient_info['storage']}"
            suggestions = ["Food storage tips", "Kitchen organization", "Food safety"]
        else:
            response = f"{ingredient_info['name']}: {ingredient_info['description']}. {ingredient_info['tips'][0]}"
            suggestions = [
                f"How to cook {ingredient_info['name']}",
                f"Substitutes for {ingredient_info['name']}",
                f"Storage tips for {ingredient_info['name']}"
            ]
        
        return jsonify({
            "success": True,
            "response": response,
            "suggestions": suggestions,
            "ingredient": ingredient_info
        })
        
    except Exception as e:
        logger.error(f"Error querying ingredient: {str(e)}")
        return jsonify({"error": "Error processing ingredient query"}), 500

@app.route('/api/cooking/tips', methods=['GET'])
def get_tips():
    """Get cooking tips"""
    try:
        category = request.args.get('category', 'general')
        difficulty = request.args.get('difficulty')
        limit = int(request.args.get('limit', 5))
        
        tips = COOKING_TIPS.get(category, COOKING_TIPS['general'])
        
        if difficulty:
            tips = [tip for tip in tips if tip['difficulty'] == difficulty]
        
        tips = tips[:limit]
        
        return jsonify({
            "success": True,
            "tips": tips,
            "category": category,
            "total": len(tips)
        })
        
    except Exception as e:
        logger.error(f"Error getting tips: {str(e)}")
        return jsonify({"error": "Error retrieving cooking tips"}), 500

@app.route('/api/cooking/tips', methods=['POST'])
def search_tips():
    """Search cooking tips"""
    try:
        data = request.get_json()
        query = data.get('query', '')
        category = data.get('category')
        
        if not query:
            return jsonify({"error": "Query is required"}), 400
        
        # Find relevant tips based on query
        query_lower = query.lower()
        relevant_tips = []
        
        # Search through all categories
        for cat, tips in COOKING_TIPS.items():
            for tip in tips:
                if (tip['title'].lower() in query_lower or 
                    tip['tip'].lower() in query_lower or
                    tip['category'].lower() in query_lower):
                    relevant_tips.append({**tip, 'category': cat})
        
        # If no specific matches, return general tips
        if not relevant_tips:
            relevant_tips = [{'category': 'general', **tip} for tip in COOKING_TIPS['general'][:3]]
        
        # Limit to top 3 most relevant
        relevant_tips = relevant_tips[:3]
        
        if relevant_tips:
            response = f"Here are some helpful cooking tips for you:\n\n" + "\n\n".join([
                f"• {tip['title']}: {tip['tip']}" for tip in relevant_tips
            ])
        else:
            response = "I don't have specific tips for that, but here are some general cooking tips that are always helpful."
        
        return jsonify({
            "success": True,
            "response": response,
            "tips": relevant_tips,
            "suggestions": [
                "Baking tips",
                "Kitchen safety",
                "Cooking techniques",
                "Seasoning advice"
            ]
        })
        
    except Exception as e:
        logger.error(f"Error searching tips: {str(e)}")
        return jsonify({"error": "Error processing tips search"}), 500

@app.route('/api/chat', methods=['POST'])
def general_chat():
    """General chat endpoint that detects if it's cooking-related"""
    try:
        data = request.get_json()
        message = data.get('message', '')
        source = data.get('source', 'general')
        
        if not message:
            return jsonify({"error": "Message is required"}), 400
        
        # Check if message is cooking-related
        cooking_keywords = [
            'cook', 'recipe', 'food', 'ingredient', 'kitchen', 'bake', 'fry', 'grill',
            'chicken', 'pasta', 'vegetable', 'meat', 'fish', 'sauce', 'seasoning',
            'temperature', 'safety', 'knife', 'cut', 'chop', 'meal', 'dinner', 'lunch',
            'breakfast', 'dessert', 'cake', 'bread', 'soup', 'salad', 'stir', 'mix',
            'oven', 'stove', 'pan', 'pot', 'utensil', 'appliance', 'nutrition', 'diet'
        ]
        
        message_lower = message.lower()
        is_cooking_related = any(keyword in message_lower for keyword in cooking_keywords)
        
        if is_cooking_related or source == "cooking_with":
            # Use cooking specialist response
            response_data = generate_cooking_response(message, source)
            response_data["mode"] = "cooking_specialist"
        else:
            # For non-cooking questions, provide a redirect to cooking focus
            response_data = {
                "response": "I'm a specialized cooking assistant! I can help you with recipes, cooking techniques, ingredient substitutions, food safety, and all things culinary. What would you like to know about cooking?",
                "suggestions": ["How to cook chicken breast", "Pasta cooking tips", "Ingredient substitutions", "Safe cooking temperatures"],
                "confidence": 0.9,
                "timestamp": datetime.now().isoformat(),
                "source": source,
                "mode": "cooking_specialist"
            }
        
        return jsonify({
            "success": True,
            **response_data
        })
        
    except Exception as e:
        logger.error(f"Error in general chat: {str(e)}")
        return jsonify({"error": "Error processing chat request"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

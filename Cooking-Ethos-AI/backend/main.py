#!/usr/bin/env python3
"""
🍳 Cooking Ethos AI - Specialized Food AI Backend
Main FastAPI application for cooking-focused AI interactions
"""

import os
import json
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
import asyncio

from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import uvicorn

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="🍳 Cooking Ethos AI",
    description="Specialized AI for cooking, food, and culinary knowledge",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for API requests/responses
class CookingChatRequest(BaseModel):
    message: str = Field(..., description="User's cooking-related question or message")
    context: Optional[Dict[str, Any]] = Field(None, description="Additional context for the conversation")
    user_preferences: Optional[Dict[str, Any]] = Field(None, description="User's cooking preferences")

class CookingChatResponse(BaseModel):
    response: str = Field(..., description="AI's cooking-focused response")
    suggestions: List[str] = Field(default_factory=list, description="Follow-up suggestions")
    confidence: float = Field(..., description="Confidence score of the response")
    timestamp: datetime = Field(default_factory=datetime.now)

class RecipeAnalysisRequest(BaseModel):
    recipe_text: str = Field(..., description="Recipe text to analyze")
    analysis_type: str = Field(default="general", description="Type of analysis to perform")

class RecipeAnalysisResponse(BaseModel):
    analysis: Dict[str, Any] = Field(..., description="Recipe analysis results")
    suggestions: List[str] = Field(default_factory=list, description="Cooking suggestions")
    confidence: float = Field(..., description="Analysis confidence score")

class FoodRecognitionRequest(BaseModel):
    image_url: str = Field(..., description="URL of the food image to analyze")
    user_preferences: Optional[Dict[str, Any]] = Field(None, description="User's food preferences")

class FoodRecognitionResponse(BaseModel):
    food_items: List[str] = Field(..., description="Identified food items")
    recipe_suggestion: Optional[Dict[str, Any]] = Field(None, description="Suggested recipe")
    cooking_tips: List[str] = Field(default_factory=list, description="Cooking tips for the foods")
    confidence: float = Field(..., description="Recognition confidence score")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Cooking Ethos AI",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

# Cooking chat endpoint
@app.post("/api/cooking/chat", response_model=CookingChatResponse)
async def cooking_chat(request: CookingChatRequest):
    """Handle cooking-related chat messages"""
    try:
        # Simple cooking-focused response logic
        message = request.message.lower()
        
        if "chicken" in message and "cook" in message:
            response = "To cook chicken breast properly, preheat your oven to 400°F (200°C). Season the chicken with salt, pepper, and your favorite herbs. Place it in a baking dish and cook for 20-25 minutes until the internal temperature reaches 165°F (74°C). Let it rest for 5 minutes before slicing."
            suggestions = ["How to make chicken marinade", "Chicken cooking techniques", "Safe cooking temperatures"]
        elif "pasta" in message and "make" in message:
            response = "To make pasta, bring a large pot of salted water to a boil. Add your pasta and cook according to package directions (usually 8-12 minutes). Drain and serve with your favorite sauce. Remember: the water should taste like seawater for proper seasoning!"
            suggestions = ["Pasta sauce recipes", "Al dente cooking tips", "Pasta types and uses"]
        elif "substitute" in message or "alternative" in message:
            response = "Here are some common cooking substitutions: Butter can be replaced with olive oil, coconut oil, or applesauce in baking. Eggs can be substituted with flax seeds, chia seeds, or commercial egg replacers. Milk can be replaced with almond milk, soy milk, or oat milk."
            suggestions = ["Baking substitutions", "Dairy alternatives", "Gluten-free options"]
        elif "temperature" in message and "safe" in message:
            response = "Safe cooking temperatures: Chicken and turkey (165°F/74°C), Ground beef (160°F/71°C), Fish (145°F/63°C), Pork (145°F/63°C), Beef steaks (145°F/63°C for medium-rare). Always use a food thermometer for accuracy!"
            suggestions = ["Food safety guidelines", "Cooking temperature charts", "Kitchen safety tips"]
        else:
            response = "I'm your specialized cooking assistant! I can help with recipes, cooking techniques, ingredient substitutions, food safety, and more. What would you like to know about cooking?"
            suggestions = ["How to cook chicken breast", "Pasta cooking tips", "Ingredient substitutions", "Safe cooking temperatures"]
        
        return CookingChatResponse(
            response=response,
            suggestions=suggestions,
            confidence=0.85
        )
    except Exception as e:
        logger.error(f"Error in cooking chat: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing cooking chat request")

# Recipe analysis endpoint
@app.post("/api/cooking/analyze-recipe", response_model=RecipeAnalysisResponse)
async def analyze_recipe(request: RecipeAnalysisRequest):
    """Analyze recipe text and provide insights"""
    try:
        recipe_text = request.recipe_text
        analysis_type = request.analysis_type
        
        # Basic recipe analysis
        analysis = {
            "ingredients": [],
            "instructions": [],
            "cooking_time": "Unknown",
            "difficulty": "Medium",
            "cuisine_type": "General",
            "dietary_info": []
        }
        
        # Extract ingredients (basic regex)
        import re
        ingredients_match = re.search(r"ingredients?:(.*?)(?=instructions?|directions?|steps?|$)", recipe_text, re.IGNORECASE | re.DOTALL)
        if ingredients_match:
            ingredients_text = ingredients_match.group(1).strip()
            analysis["ingredients"] = [ing.strip() for ing in ingredients_text.split('\n') if ing.strip()]
        
        # Extract instructions
        instructions_match = re.search(r"instructions?|directions?|steps?:(.*?)(?=servings?|yield|$)", recipe_text, re.IGNORECASE | re.DOTALL)
        if instructions_match:
            instructions_text = instructions_match.group(1).strip()
            analysis["instructions"] = [step.strip() for step in instructions_text.split('\n') if step.strip()]
        
        suggestions = [
            "Consider adding more seasoning for enhanced flavor",
            "Make sure to preheat your oven if baking is involved",
            "Check ingredient freshness before starting"
        ]
        
        return RecipeAnalysisResponse(
            analysis=analysis,
            suggestions=suggestions,
            confidence=0.80
        )
    except Exception as e:
        logger.error(f"Error analyzing recipe: {str(e)}")
        raise HTTPException(status_code=500, detail="Error analyzing recipe")

# Food recognition endpoint
@app.post("/api/cooking/recognize-food", response_model=FoodRecognitionResponse)
async def recognize_food(request: FoodRecognitionRequest):
    """Recognize food in images and provide cooking suggestions"""
    try:
        # Placeholder for food recognition
        # In a real implementation, this would use computer vision models
        
        food_items = ["chicken", "vegetables", "rice"]  # Placeholder
        recipe_suggestion = {
            "name": "Simple Chicken Stir-Fry",
            "ingredients": ["chicken breast", "mixed vegetables", "soy sauce", "garlic", "ginger"],
            "instructions": ["Cut chicken into pieces", "Stir-fry vegetables", "Add chicken and sauce", "Serve over rice"]
        }
        cooking_tips = [
            "Make sure chicken is cooked to 165°F for safety",
            "Don't overcrowd the pan when stir-frying",
            "Prep all ingredients before starting to cook"
        ]
        
        return FoodRecognitionResponse(
            food_items=food_items,
            recipe_suggestion=recipe_suggestion,
            cooking_tips=cooking_tips,
            confidence=0.75
        )
    except Exception as e:
        logger.error(f"Error recognizing food: {str(e)}")
        raise HTTPException(status_code=500, detail="Error recognizing food")

# Ingredient information endpoint
@app.get("/api/cooking/ingredient/{ingredient_name}")
async def get_ingredient_info(ingredient_name: str):
    """Get information about a specific ingredient"""
    try:
        # Placeholder ingredient database
        ingredient_db = {
            "chicken": {
                "description": "Versatile protein source",
                "cooking_methods": ["bake", "grill", "pan-fry", "roast"],
                "substitutions": ["turkey", "tofu", "tempeh"],
                "nutrition": "High protein, low fat"
            },
            "tomato": {
                "description": "Fruit commonly used as a vegetable",
                "cooking_methods": ["raw", "cook", "roast", "sauce"],
                "substitutions": ["bell peppers", "mushrooms"],
                "nutrition": "Rich in lycopene and vitamin C"
            }
        }
        
        ingredient_info = ingredient_db.get(ingredient_name.lower(), {
            "description": "Ingredient information not available",
            "cooking_methods": [],
            "substitutions": [],
            "nutrition": "Information not available"
        })
        
        return {
            "ingredient": ingredient_name,
            "info": ingredient_info
        }
    except Exception as e:
        logger.error(f"Error getting ingredient info: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving ingredient information")

# Cooking techniques endpoint
@app.get("/api/cooking/techniques")
async def get_cooking_techniques():
    """Get list of cooking techniques and methods"""
    try:
        techniques = {
            "basic": ["sautéing", "boiling", "steaming", "baking"],
            "advanced": ["braising", "sous vide", "smoking", "fermenting"],
            "baking": ["creaming", "folding", "kneading", "proofing"],
            "grilling": ["direct heat", "indirect heat", "smoking", "charcoal"]
        }
        
        return {
            "techniques": techniques,
            "total_count": sum(len(tech_list) for tech_list in techniques.values())
        }
    except Exception as e:
        logger.error(f"Error getting cooking techniques: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving cooking techniques")

# Recipe suggestions endpoint
@app.get("/api/cooking/suggestions")
async def get_recipe_suggestions(cuisine: Optional[str] = None, difficulty: Optional[str] = None):
    """Get recipe suggestions based on criteria"""
    try:
        suggestions = [
            "Classic Spaghetti Carbonara",
            "Simple Chicken Stir-Fry",
            "Easy Chocolate Chip Cookies",
            "Quick Vegetable Soup",
            "Basic Grilled Cheese Sandwich"
        ]
        
        return {
            "suggestions": suggestions,
            "criteria": {"cuisine": cuisine, "difficulty": difficulty},
            "total_count": len(suggestions)
        }
    except Exception as e:
        logger.error(f"Error getting recipe suggestions: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving recipe suggestions")

# Cooking tips endpoint
@app.get("/api/cooking/tips")
async def get_cooking_tips(category: Optional[str] = None):
    """Get cooking tips and advice"""
    try:
        tips_db = {
            "general": [
                "Always read the recipe completely before starting",
                "Prep all ingredients before cooking (mise en place)",
                "Taste as you cook and adjust seasoning",
                "Keep your knives sharp for safer and easier cutting"
            ],
            "baking": [
                "Measure ingredients precisely for consistent results",
                "Don't overmix batter to avoid tough baked goods",
                "Use room temperature ingredients unless specified",
                "Preheat your oven for even baking"
            ],
            "safety": [
                "Wash hands frequently while cooking",
                "Use separate cutting boards for raw meat and vegetables",
                "Cook meat to safe internal temperatures",
                "Keep hot foods hot and cold foods cold"
            ]
        }
        
        if category and category in tips_db:
            tips = tips_db[category]
        else:
            tips = tips_db["general"]
        
        return {
            "tips": tips,
            "category": category or "general",
            "total_count": len(tips)
        }
    except Exception as e:
        logger.error(f"Error getting cooking tips: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving cooking tips")

if __name__ == "__main__":
    # Run the application
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

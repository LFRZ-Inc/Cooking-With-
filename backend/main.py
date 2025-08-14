#!/usr/bin/env python3
"""
🍳 Cooking Ethos AI - Specialized Food AI Backend

A specialized version of Ethos AI focused exclusively on cooking, food, and culinary knowledge.
This AI provides expert advice on recipes, ingredients, techniques, and all things food-related.
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

# Import cooking-specific modules
from cooking_ai import CookingAI
from cooking_knowledge import CookingKnowledgeBase
from cooking_chat import CookingChatInterface
from recipe_analyzer import RecipeAnalyzer
from food_recognition import FoodRecognitionEngine

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

# Initialize cooking AI components
cooking_ai = CookingAI()
knowledge_base = CookingKnowledgeBase()
chat_interface = CookingChatInterface()
recipe_analyzer = RecipeAnalyzer()
food_recognition = FoodRecognitionEngine()

# Pydantic models for API requests/responses
class CookingChatRequest(BaseModel):
    message: str = Field(..., description="User's cooking-related question or message")
    context: Optional[Dict[str, Any]] = Field(default=None, description="Additional context (recipe, ingredients, etc.)")
    user_preferences: Optional[Dict[str, Any]] = Field(default=None, description="User's cooking preferences")

class CookingChatResponse(BaseModel):
    response: str = Field(..., description="AI's cooking-focused response")
    suggestions: Optional[List[str]] = Field(default=None, description="Additional cooking suggestions")
    confidence: float = Field(..., description="Confidence score of the response")
    related_topics: Optional[List[str]] = Field(default=None, description="Related cooking topics")

class RecipeAnalysisRequest(BaseModel):
    recipe_text: str = Field(..., description="Recipe text to analyze")
    analysis_type: str = Field(default="general", description="Type of analysis (general, ingredients, techniques, etc.)")

class RecipeAnalysisResponse(BaseModel):
    analysis: Dict[str, Any] = Field(..., description="Detailed recipe analysis")
    suggestions: List[str] = Field(..., description="Improvement suggestions")
    difficulty: str = Field(..., description="Estimated difficulty level")
    cooking_time: str = Field(..., description="Estimated cooking time")
    nutrition_info: Optional[Dict[str, Any]] = Field(default=None, description="Nutritional information")

class FoodRecognitionRequest(BaseModel):
    image_url: str = Field(..., description="URL of food image to analyze")
    user_preferences: Optional[Dict[str, Any]] = Field(default=None, description="User's dietary preferences")

class FoodRecognitionResponse(BaseModel):
    food_items: List[str] = Field(..., description="Identified food items")
    recipe_suggestion: Optional[Dict[str, Any]] = Field(default=None, description="Suggested recipe")
    cooking_tips: List[str] = Field(..., description="Cooking tips for the identified foods")
    confidence: float = Field(..., description="Recognition confidence score")

class IngredientInfoRequest(BaseModel):
    ingredient_name: str = Field(..., description="Name of ingredient to get information about")

class IngredientInfoResponse(BaseModel):
    name: str = Field(..., description="Ingredient name")
    description: str = Field(..., description="Detailed description")
    substitutes: List[str] = Field(..., description="Possible substitutes")
    storage_tips: List[str] = Field(..., description="Storage recommendations")
    cooking_tips: List[str] = Field(..., description="Cooking tips")
    nutritional_info: Optional[Dict[str, Any]] = Field(default=None, description="Nutritional information")

class CookingTechniqueRequest(BaseModel):
    technique_name: str = Field(..., description="Name of cooking technique to explain")

class CookingTechniqueResponse(BaseModel):
    name: str = Field(..., description="Technique name")
    description: str = Field(..., description="Detailed explanation")
    steps: List[str] = Field(..., description="Step-by-step instructions")
    tips: List[str] = Field(..., description="Pro tips")
    common_mistakes: List[str] = Field(..., description="Common mistakes to avoid")
    equipment_needed: List[str] = Field(..., description="Required equipment")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Cooking Ethos AI",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "components": {
            "cooking_ai": cooking_ai.is_ready(),
            "knowledge_base": knowledge_base.is_ready(),
            "chat_interface": chat_interface.is_ready(),
            "recipe_analyzer": recipe_analyzer.is_ready(),
            "food_recognition": food_recognition.is_ready()
        }
    }

# Cooking chat endpoint
@app.post("/api/cooking/chat", response_model=CookingChatResponse)
async def cooking_chat(request: CookingChatRequest):
    """
    Chat with Cooking Ethos AI about food and cooking topics.
    This endpoint is specialized for cooking-related conversations only.
    """
    try:
        logger.info(f"Processing cooking chat request: {request.message[:50]}...")
        
        # Process the cooking-focused chat
        response = await chat_interface.process_message(
            message=request.message,
            context=request.context,
            user_preferences=request.user_preferences
        )
        
        return CookingChatResponse(**response)
        
    except Exception as e:
        logger.error(f"Error in cooking chat: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Cooking chat error: {str(e)}")

# Recipe analysis endpoint
@app.post("/api/cooking/analyze-recipe", response_model=RecipeAnalysisResponse)
async def analyze_recipe(request: RecipeAnalysisRequest):
    """
    Analyze a recipe and provide detailed insights, suggestions, and improvements.
    """
    try:
        logger.info(f"Analyzing recipe: {request.analysis_type}")
        
        # Analyze the recipe
        analysis = await recipe_analyzer.analyze_recipe(
            recipe_text=request.recipe_text,
            analysis_type=request.analysis_type
        )
        
        return RecipeAnalysisResponse(**analysis)
        
    except Exception as e:
        logger.error(f"Error in recipe analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Recipe analysis error: {str(e)}")

# Food recognition endpoint
@app.post("/api/cooking/recognize-food", response_model=FoodRecognitionResponse)
async def recognize_food(request: FoodRecognitionRequest):
    """
    Recognize food items in an image and provide cooking suggestions.
    """
    try:
        logger.info(f"Recognizing food in image: {request.image_url}")
        
        # Recognize food in the image
        recognition = await food_recognition.recognize_food(
            image_url=request.image_url,
            user_preferences=request.user_preferences
        )
        
        return FoodRecognitionResponse(**recognition)
        
    except Exception as e:
        logger.error(f"Error in food recognition: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Food recognition error: {str(e)}")

# Ingredient information endpoint
@app.post("/api/cooking/ingredients", response_model=IngredientInfoResponse)
async def get_ingredient_info(request: IngredientInfoRequest):
    """
    Get detailed information about a specific ingredient.
    """
    try:
        logger.info(f"Getting ingredient info: {request.ingredient_name}")
        
        # Get ingredient information
        info = await knowledge_base.get_ingredient_info(request.ingredient_name)
        
        return IngredientInfoResponse(**info)
        
    except Exception as e:
        logger.error(f"Error getting ingredient info: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ingredient info error: {str(e)}")

# Cooking technique endpoint
@app.post("/api/cooking/techniques", response_model=CookingTechniqueResponse)
async def get_cooking_technique(request: CookingTechniqueRequest):
    """
    Get detailed information about a specific cooking technique.
    """
    try:
        logger.info(f"Getting cooking technique: {request.technique_name}")
        
        # Get cooking technique information
        technique = await knowledge_base.get_cooking_technique(request.technique_name)
        
        return CookingTechniqueResponse(**technique)
        
    except Exception as e:
        logger.error(f"Error getting cooking technique: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Cooking technique error: {str(e)}")

# Recipe suggestions endpoint
@app.post("/api/cooking/suggestions")
async def get_recipe_suggestions(request: CookingChatRequest):
    """
    Get personalized recipe suggestions based on user preferences and context.
    """
    try:
        logger.info("Getting recipe suggestions")
        
        # Get recipe suggestions
        suggestions = await cooking_ai.get_recipe_suggestions(
            context=request.context,
            user_preferences=request.user_preferences
        )
        
        return {
            "suggestions": suggestions,
            "reasoning": "Based on your preferences and available ingredients"
        }
        
    except Exception as e:
        logger.error(f"Error getting recipe suggestions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Recipe suggestions error: {str(e)}")

# Cooking tips endpoint
@app.get("/api/cooking/tips")
async def get_cooking_tips(category: Optional[str] = None):
    """
    Get cooking tips for a specific category or general tips.
    """
    try:
        logger.info(f"Getting cooking tips for category: {category}")
        
        # Get cooking tips
        tips = await knowledge_base.get_cooking_tips(category)
        
        return {
            "tips": tips,
            "category": category or "general"
        }
        
    except Exception as e:
        logger.error(f"Error getting cooking tips: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Cooking tips error: {str(e)}")

# Error handlers
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Global exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)}
    )

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize components on startup"""
    logger.info("🍳 Starting Cooking Ethos AI...")
    
    try:
        # Initialize cooking AI components
        await cooking_ai.initialize()
        await knowledge_base.initialize()
        await chat_interface.initialize()
        await recipe_analyzer.initialize()
        await food_recognition.initialize()
        
        logger.info("✅ Cooking Ethos AI initialized successfully!")
        
    except Exception as e:
        logger.error(f"❌ Failed to initialize Cooking Ethos AI: {str(e)}")
        raise

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("🛑 Shutting down Cooking Ethos AI...")
    
    try:
        # Cleanup components
        await cooking_ai.cleanup()
        await knowledge_base.cleanup()
        await chat_interface.cleanup()
        await recipe_analyzer.cleanup()
        await food_recognition.cleanup()
        
        logger.info("✅ Cooking Ethos AI shutdown complete!")
        
    except Exception as e:
        logger.error(f"❌ Error during shutdown: {str(e)}")

if __name__ == "__main__":
    # Run the application
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

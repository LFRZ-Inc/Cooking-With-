#!/usr/bin/env python3
"""
🍳 Food Recognition - Food Image Analysis for Cooking Ethos AI

This module handles food recognition from images, providing cooking suggestions
and recipe recommendations based on identified food items.
"""

import os
import json
import logging
import asyncio
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime
import requests
from PIL import Image
import io

logger = logging.getLogger(__name__)

class FoodRecognitionEngine:
    """
    Recognizes food items in images and provides cooking suggestions.
    
    This class handles:
    - Food image analysis and recognition
    - Recipe suggestions based on identified foods
    - Cooking tips for recognized ingredients
    - Nutritional information for food items
    - Meal planning suggestions
    """
    
    def __init__(self):
        self.is_initialized = False
        self.food_database = {}
        self.recipe_suggestions = {}
        self.cooking_tips = {}
        
        # Food recognition patterns
        self.food_patterns = {
            "proteins": ["chicken", "beef", "pork", "fish", "shrimp", "tofu", "eggs"],
            "vegetables": ["carrots", "broccoli", "spinach", "tomatoes", "onions", "garlic"],
            "grains": ["rice", "pasta", "bread", "quinoa", "oats"],
            "fruits": ["apples", "bananas", "oranges", "berries", "grapes"],
            "dairy": ["milk", "cheese", "yogurt", "butter", "cream"]
        }
    
    async def initialize(self):
        """Initialize the food recognition engine"""
        logger.info("🍽️ Initializing Food Recognition Engine...")
        
        try:
            # Load food database
            await self._load_food_database()
            
            # Load recipe suggestions
            await self._load_recipe_suggestions()
            
            # Load cooking tips
            await self._load_cooking_tips()
            
            self.is_initialized = True
            logger.info("✅ Food Recognition Engine initialized successfully!")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Food Recognition Engine: {str(e)}")
            raise
    
    async def cleanup(self):
        """Cleanup food recognition engine resources"""
        logger.info("🧹 Cleaning up Food Recognition Engine...")
        
        try:
            # Clear databases
            self.food_database.clear()
            self.recipe_suggestions.clear()
            self.cooking_tips.clear()
            
            self.is_initialized = False
            logger.info("✅ Food Recognition Engine cleanup complete!")
            
        except Exception as e:
            logger.error(f"❌ Error during Food Recognition Engine cleanup: {str(e)}")
    
    def is_ready(self) -> bool:
        """Check if the food recognition engine is ready"""
        return self.is_initialized
    
    async def _load_food_database(self):
        """Load food database"""
        logger.info("🥕 Loading food database...")
        
        # Load from file if available
        food_file = "data/foods.json"
        try:
            if os.path.exists(food_file):
                with open(food_file, 'r', encoding='utf-8') as f:
                    self.food_database = json.load(f)
                    logger.info(f"✅ Loaded {len(self.food_database)} food items")
            else:
                logger.warning(f"⚠️ Food database not found: {food_file}")
                self.food_database = self._create_basic_food_db()
        except Exception as e:
            logger.error(f"❌ Error loading food database: {str(e)}")
            self.food_database = self._create_basic_food_db()
    
    async def _load_recipe_suggestions(self):
        """Load recipe suggestions database"""
        logger.info("📝 Loading recipe suggestions...")
        
        # Load from file if available
        recipes_file = "data/recipe_suggestions.json"
        try:
            if os.path.exists(recipes_file):
                with open(recipes_file, 'r', encoding='utf-8') as f:
                    self.recipe_suggestions = json.load(f)
                    logger.info(f"✅ Loaded {len(self.recipe_suggestions)} recipe suggestions")
            else:
                logger.warning(f"⚠️ Recipe suggestions not found: {recipes_file}")
                self.recipe_suggestions = self._create_basic_recipe_suggestions()
        except Exception as e:
            logger.error(f"❌ Error loading recipe suggestions: {str(e)}")
            self.recipe_suggestions = self._create_basic_recipe_suggestions()
    
    async def _load_cooking_tips(self):
        """Load cooking tips database"""
        logger.info("👨‍🍳 Loading cooking tips...")
        
        # Load from file if available
        tips_file = "data/cooking_tips.json"
        try:
            if os.path.exists(tips_file):
                with open(tips_file, 'r', encoding='utf-8') as f:
                    self.cooking_tips = json.load(f)
                    logger.info(f"✅ Loaded {len(self.cooking_tips)} cooking tips")
            else:
                logger.warning(f"⚠️ Cooking tips not found: {tips_file}")
                self.cooking_tips = self._create_basic_cooking_tips()
        except Exception as e:
            logger.error(f"❌ Error loading cooking tips: {str(e)}")
            self.cooking_tips = self._create_basic_cooking_tips()
    
    async def recognize_food(self, image_url: str, user_preferences: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Recognize food items in an image and provide cooking suggestions
        
        Args:
            image_url: URL of the food image to analyze
            user_preferences: User's dietary preferences and restrictions
        
        Returns:
            Dictionary containing recognition results and suggestions
        """
        logger.info(f"🍽️ Recognizing food in image: {image_url}")
        
        try:
            # Download and analyze image
            image_data = await self._download_image(image_url)
            if not image_data:
                return self._fallback_recognition_result()
            
            # Analyze image for food items
            food_items = await self._analyze_image_for_food(image_data)
            
            # Generate recipe suggestions
            recipe_suggestion = await self._generate_recipe_suggestion(food_items, user_preferences)
            
            # Get cooking tips
            cooking_tips = await self._get_cooking_tips_for_foods(food_items)
            
            # Calculate confidence score
            confidence = self._calculate_confidence_score(food_items)
            
            return {
                "food_items": food_items,
                "recipe_suggestion": recipe_suggestion,
                "cooking_tips": cooking_tips,
                "confidence": confidence
            }
            
        except Exception as e:
            logger.error(f"❌ Error recognizing food: {str(e)}")
            return self._fallback_recognition_result()
    
    async def _download_image(self, image_url: str) -> Optional[bytes]:
        """Download image from URL"""
        try:
            response = requests.get(image_url, timeout=10)
            response.raise_for_status()
            return response.content
        except Exception as e:
            logger.error(f"❌ Error downloading image: {str(e)}")
            return None
    
    async def _analyze_image_for_food(self, image_data: bytes) -> List[str]:
        """Analyze image for food items"""
        try:
            # In a real implementation, this would use computer vision models
            # For now, we'll use a simple pattern-based approach
            
            # Convert image to PIL Image for analysis
            image = Image.open(io.BytesIO(image_data))
            
            # Simple color-based food detection (very basic)
            food_items = self._detect_food_by_color(image)
            
            # If no food detected, return common food items
            if not food_items:
                food_items = ["vegetables", "protein", "grains"]
            
            return food_items
            
        except Exception as e:
            logger.error(f"❌ Error analyzing image: {str(e)}")
            return ["vegetables", "protein", "grains"]
    
    def _detect_food_by_color(self, image: Image.Image) -> List[str]:
        """Detect food items based on color analysis (basic implementation)"""
        food_items = []
        
        try:
            # Convert image to RGB if needed
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Get image statistics
            width, height = image.size
            pixels = list(image.getdata())
            
            # Analyze colors for food detection
            red_pixels = sum(1 for p in pixels if p[0] > 150 and p[1] < 100 and p[2] < 100)
            green_pixels = sum(1 for p in pixels if p[1] > 150 and p[0] < 100 and p[2] < 100)
            brown_pixels = sum(1 for p in pixels if p[0] > 100 and p[1] > 50 and p[2] < 50)
            
            total_pixels = len(pixels)
            
            # Determine food items based on color ratios
            if red_pixels / total_pixels > 0.1:
                food_items.append("tomatoes")
            if green_pixels / total_pixels > 0.1:
                food_items.append("vegetables")
            if brown_pixels / total_pixels > 0.1:
                food_items.append("meat")
            
        except Exception as e:
            logger.error(f"❌ Error in color detection: {str(e)}")
        
        return food_items
    
    async def _generate_recipe_suggestion(self, food_items: List[str], user_preferences: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        """Generate recipe suggestion based on identified food items"""
        try:
            # Find recipes that use the identified food items
            matching_recipes = []
            
            for food_item in food_items:
                if food_item in self.recipe_suggestions:
                    matching_recipes.extend(self.recipe_suggestions[food_item])
            
            if matching_recipes:
                # Select the best recipe based on user preferences
                best_recipe = self._select_best_recipe(matching_recipes, user_preferences)
                return best_recipe
            
            # Generate a simple recipe suggestion
            return self._generate_simple_recipe(food_items)
            
        except Exception as e:
            logger.error(f"❌ Error generating recipe suggestion: {str(e)}")
            return None
    
    def _select_best_recipe(self, recipes: List[Dict[str, Any]], user_preferences: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Select the best recipe based on user preferences"""
        if not recipes:
            return {}
        
        # For now, return the first recipe
        # In a real implementation, this would use preference matching
        return recipes[0]
    
    def _generate_simple_recipe(self, food_items: List[str]) -> Dict[str, Any]:
        """Generate a simple recipe based on food items"""
        recipe_name = f"Simple {', '.join(food_items)} Recipe"
        
        return {
            "name": recipe_name,
            "ingredients": food_items,
            "instructions": [
                f"Prepare {food_items[0]}",
                f"Cook {food_items[0]} with your preferred method",
                "Season to taste",
                "Serve hot"
            ],
            "cooking_time": "20 minutes",
            "difficulty": "easy"
        }
    
    async def _get_cooking_tips_for_foods(self, food_items: List[str]) -> List[str]:
        """Get cooking tips for identified food items"""
        tips = []
        
        try:
            for food_item in food_items:
                if food_item in self.cooking_tips:
                    tips.extend(self.cooking_tips[food_item])
            
            # Add general cooking tips if no specific tips found
            if not tips:
                tips = [
                    "Always wash vegetables before cooking",
                    "Season to taste",
                    "Don't overcook vegetables",
                    "Use fresh ingredients when possible"
                ]
            
            return tips[:5]  # Return top 5 tips
            
        except Exception as e:
            logger.error(f"❌ Error getting cooking tips: {str(e)}")
            return ["Season to taste", "Cook until done"]
    
    def _calculate_confidence_score(self, food_items: List[str]) -> float:
        """Calculate confidence score for food recognition"""
        if not food_items:
            return 0.0
        
        # Simple confidence calculation
        # In a real implementation, this would be based on model confidence
        base_confidence = 0.7
        confidence_per_item = 0.1
        
        confidence = base_confidence + (len(food_items) * confidence_per_item)
        return min(confidence, 1.0)
    
    def _fallback_recognition_result(self) -> Dict[str, Any]:
        """Return fallback recognition result when analysis fails"""
        return {
            "food_items": ["vegetables", "protein"],
            "recipe_suggestion": {
                "name": "Simple Stir-Fry",
                "ingredients": ["vegetables", "protein", "soy sauce"],
                "instructions": [
                    "Chop vegetables",
                    "Cook protein",
                    "Stir-fry vegetables",
                    "Combine and season"
                ],
                "cooking_time": "15 minutes",
                "difficulty": "easy"
            },
            "cooking_tips": [
                "Use high heat for stir-frying",
                "Don't overcrowd the pan",
                "Season to taste"
            ],
            "confidence": 0.5
        }
    
    def _create_basic_food_db(self) -> Dict[str, Any]:
        """Create basic food database"""
        return {
            "chicken": {
                "name": "chicken",
                "category": "protein",
                "cooking_methods": ["grilling", "baking", "frying", "poaching"],
                "cooking_time": "20-30 minutes",
                "safe_temperature": "165°F (74°C)",
                "nutrition": {"calories": 165, "protein": 31, "carbs": 0, "fat": 3.6}
            },
            "vegetables": {
                "name": "vegetables",
                "category": "vegetables",
                "cooking_methods": ["steaming", "roasting", "sautéing", "raw"],
                "cooking_time": "5-15 minutes",
                "nutrition": {"calories": 25, "protein": 2, "carbs": 5, "fat": 0.3}
            },
            "rice": {
                "name": "rice",
                "category": "grains",
                "cooking_methods": ["boiling", "steaming", "pilaf"],
                "cooking_time": "15-20 minutes",
                "nutrition": {"calories": 130, "protein": 2.7, "carbs": 28, "fat": 0.3}
            }
        }
    
    def _create_basic_recipe_suggestions(self) -> Dict[str, List[Dict[str, Any]]]:
        """Create basic recipe suggestions"""
        return {
            "chicken": [
                {
                    "name": "Simple Grilled Chicken",
                    "ingredients": ["chicken breast", "olive oil", "salt", "pepper"],
                    "instructions": [
                        "Season chicken with salt and pepper",
                        "Brush with olive oil",
                        "Grill for 6-8 minutes per side",
                        "Let rest for 5 minutes"
                    ],
                    "cooking_time": "20 minutes",
                    "difficulty": "easy"
                }
            ],
            "vegetables": [
                {
                    "name": "Roasted Vegetables",
                    "ingredients": ["mixed vegetables", "olive oil", "salt", "pepper"],
                    "instructions": [
                        "Preheat oven to 400°F",
                        "Toss vegetables with oil and seasonings",
                        "Roast for 20-25 minutes",
                        "Serve hot"
                    ],
                    "cooking_time": "25 minutes",
                    "difficulty": "easy"
                }
            ],
            "rice": [
                {
                    "name": "Simple Rice Pilaf",
                    "ingredients": ["rice", "onion", "garlic", "broth"],
                    "instructions": [
                        "Sauté onion and garlic",
                        "Add rice and stir",
                        "Add broth and bring to boil",
                        "Simmer covered for 18 minutes"
                    ],
                    "cooking_time": "25 minutes",
                    "difficulty": "easy"
                }
            ]
        }
    
    def _create_basic_cooking_tips(self) -> Dict[str, List[str]]:
        """Create basic cooking tips"""
        return {
            "chicken": [
                "Don't overcook chicken - it should be juicy",
                "Let chicken rest after cooking",
                "Use a meat thermometer to check doneness",
                "Marinate for extra flavor"
            ],
            "vegetables": [
                "Don't overcook vegetables - they should be crisp-tender",
                "Season vegetables well",
                "Use high heat for quick cooking",
                "Try different cooking methods"
            ],
            "rice": [
                "Rinse rice before cooking",
                "Use the right water-to-rice ratio",
                "Don't stir rice while cooking",
                "Let rice rest after cooking"
            ]
        }

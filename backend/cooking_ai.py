#!/usr/bin/env python3
"""
🍳 Cooking AI - Core AI Processing for Cooking Ethos AI

This module contains the core AI processing logic specifically designed for cooking,
food recognition, recipe analysis, and culinary knowledge.
"""

import os
import json
import logging
import asyncio
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime
import re

# AI/ML imports
import numpy as np
from transformers import pipeline, AutoTokenizer, AutoModel
import torch

# Cooking-specific imports
from cooking_prompts import COOKING_PROMPTS
from cooking_models import CookingModels

logger = logging.getLogger(__name__)

class CookingAI:
    """
    Core AI processing class for cooking-specific tasks.
    
    This class handles:
    - Recipe analysis and understanding
    - Ingredient recognition and substitution
    - Cooking technique analysis
    - Food safety and best practices
    - Nutritional analysis
    - Recipe suggestions and recommendations
    """
    
    def __init__(self):
        self.models = CookingModels()
        self.is_initialized = False
        self.cooking_knowledge = {}
        self.recipe_patterns = {}
        self.ingredient_database = {}
        self.technique_database = {}
        
        # Cooking-specific configurations
        self.cooking_context = {
            "cuisine_types": [
                "italian", "french", "chinese", "japanese", "indian", "mexican",
                "thai", "mediterranean", "american", "greek", "spanish", "korean",
                "vietnamese", "lebanese", "turkish", "moroccan", "ethiopian"
            ],
            "cooking_methods": [
                "baking", "grilling", "frying", "boiling", "steaming", "roasting",
                "sautéing", "braising", "poaching", "smoking", "pickling", "fermenting"
            ],
            "difficulty_levels": ["beginner", "intermediate", "advanced", "expert"],
            "dietary_restrictions": [
                "vegetarian", "vegan", "gluten-free", "dairy-free", "nut-free",
                "low-carb", "keto", "paleo", "mediterranean", "pescatarian"
            ]
        }
    
    async def initialize(self):
        """Initialize the Cooking AI system"""
        logger.info("🍳 Initializing Cooking AI...")
        
        try:
            # Load cooking models
            await self.models.load_models()
            
            # Load cooking knowledge base
            await self._load_cooking_knowledge()
            
            # Load recipe patterns
            await self._load_recipe_patterns()
            
            # Load ingredient database
            await self._load_ingredient_database()
            
            # Load technique database
            await self._load_technique_database()
            
            self.is_initialized = True
            logger.info("✅ Cooking AI initialized successfully!")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Cooking AI: {str(e)}")
            raise
    
    async def cleanup(self):
        """Cleanup resources"""
        logger.info("🧹 Cleaning up Cooking AI...")
        
        try:
            # Cleanup models
            await self.models.cleanup()
            
            # Clear caches
            self.cooking_knowledge.clear()
            self.recipe_patterns.clear()
            self.ingredient_database.clear()
            self.technique_database.clear()
            
            self.is_initialized = False
            logger.info("✅ Cooking AI cleanup complete!")
            
        except Exception as e:
            logger.error(f"❌ Error during Cooking AI cleanup: {str(e)}")
    
    def is_ready(self) -> bool:
        """Check if the Cooking AI is ready"""
        return self.is_initialized and self.models.is_ready()
    
    async def _load_cooking_knowledge(self):
        """Load cooking knowledge base"""
        logger.info("📚 Loading cooking knowledge base...")
        
        # Load cooking knowledge from data files
        knowledge_files = [
            "data/cooking_techniques.json",
            "data/ingredient_properties.json",
            "data/cuisine_knowledge.json",
            "data/food_safety.json",
            "data/nutritional_data.json"
        ]
        
        for file_path in knowledge_files:
            try:
                if os.path.exists(file_path):
                    with open(file_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        self.cooking_knowledge[os.path.basename(file_path)] = data
                        logger.info(f"✅ Loaded {file_path}")
                else:
                    logger.warning(f"⚠️ Knowledge file not found: {file_path}")
            except Exception as e:
                logger.error(f"❌ Error loading {file_path}: {str(e)}")
    
    async def _load_recipe_patterns(self):
        """Load recipe parsing patterns"""
        logger.info("📝 Loading recipe patterns...")
        
        self.recipe_patterns = {
            "ingredients": [
                r"(\d+(?:\.\d+)?)\s*(\w+)\s+(.+)",  # "2 cups flour"
                r"(\d+(?:\.\d+)?)\s*(.+)",  # "2 large eggs"
                r"(.+)\s+to\s+taste",  # "salt to taste"
            ],
            "instructions": [
                r"(\d+)\.\s*(.+)",  # "1. Preheat oven"
                r"Step\s+(\d+):\s*(.+)",  # "Step 1: Preheat oven"
            ],
            "cooking_times": [
                r"(\d+)\s*(?:minutes?|mins?|hours?|hrs?)",  # "30 minutes"
                r"(\d+)\s*-\s*(\d+)\s*(?:minutes?|mins?|hours?|hrs?)",  # "30-45 minutes"
            ],
            "temperatures": [
                r"(\d+)\s*(?:°F|°C|degrees?)",  # "350°F"
                r"(\d+)\s*-\s*(\d+)\s*(?:°F|°C|degrees?)",  # "350-375°F"
            ]
        }
    
    async def _load_ingredient_database(self):
        """Load ingredient database"""
        logger.info("🥕 Loading ingredient database...")
        
        # Load comprehensive ingredient data
        ingredient_file = "data/ingredients.json"
        try:
            if os.path.exists(ingredient_file):
                with open(ingredient_file, 'r', encoding='utf-8') as f:
                    self.ingredient_database = json.load(f)
                    logger.info(f"✅ Loaded {len(self.ingredient_database)} ingredients")
            else:
                logger.warning(f"⚠️ Ingredient database not found: {ingredient_file}")
                # Create basic ingredient database
                self.ingredient_database = self._create_basic_ingredient_db()
        except Exception as e:
            logger.error(f"❌ Error loading ingredient database: {str(e)}")
            self.ingredient_database = self._create_basic_ingredient_db()
    
    async def _load_technique_database(self):
        """Load cooking technique database"""
        logger.info("👨‍🍳 Loading cooking technique database...")
        
        # Load cooking techniques data
        technique_file = "data/cooking_techniques.json"
        try:
            if os.path.exists(technique_file):
                with open(technique_file, 'r', encoding='utf-8') as f:
                    self.technique_database = json.load(f)
                    logger.info(f"✅ Loaded {len(self.technique_database)} cooking techniques")
            else:
                logger.warning(f"⚠️ Technique database not found: {technique_file}")
                # Create basic technique database
                self.technique_database = self._create_basic_technique_db()
        except Exception as e:
            logger.error(f"❌ Error loading technique database: {str(e)}")
            self.technique_database = self._create_basic_technique_db()
    
    def _create_basic_ingredient_db(self) -> Dict[str, Any]:
        """Create basic ingredient database"""
        return {
            "flour": {
                "name": "flour",
                "category": "grains",
                "substitutes": ["almond flour", "coconut flour", "oat flour"],
                "storage": "cool, dry place",
                "shelf_life": "6-12 months",
                "nutrition": {"calories": 364, "protein": 10, "carbs": 76, "fat": 1}
            },
            "eggs": {
                "name": "eggs",
                "category": "dairy_eggs",
                "substitutes": ["flax eggs", "chia eggs", "banana"],
                "storage": "refrigerated",
                "shelf_life": "3-5 weeks",
                "nutrition": {"calories": 155, "protein": 13, "carbs": 1, "fat": 11}
            },
            "butter": {
                "name": "butter",
                "category": "dairy_eggs",
                "substitutes": ["olive oil", "coconut oil", "applesauce"],
                "storage": "refrigerated",
                "shelf_life": "1-3 months",
                "nutrition": {"calories": 717, "protein": 1, "carbs": 0, "fat": 81}
            }
        }
    
    def _create_basic_technique_db(self) -> Dict[str, Any]:
        """Create basic cooking technique database"""
        return {
            "sautéing": {
                "name": "sautéing",
                "description": "Quick cooking over high heat with minimal oil",
                "steps": [
                    "Heat oil in a pan over medium-high heat",
                    "Add ingredients in small batches",
                    "Stir frequently to prevent burning",
                    "Cook until desired doneness"
                ],
                "tips": [
                    "Don't overcrowd the pan",
                    "Use high smoke point oils",
                    "Keep ingredients moving"
                ],
                "equipment": ["frying pan", "spatula", "oil"],
                "common_mistakes": ["overcrowding", "low heat", "not stirring"]
            },
            "baking": {
                "name": "baking",
                "description": "Cooking with dry heat in an enclosed space",
                "steps": [
                    "Preheat oven to specified temperature",
                    "Prepare ingredients and pan",
                    "Place in oven and bake for specified time",
                    "Check for doneness"
                ],
                "tips": [
                    "Always preheat the oven",
                    "Use the correct pan size",
                    "Don't open the oven too often"
                ],
                "equipment": ["oven", "baking pan", "thermometer"],
                "common_mistakes": ["not preheating", "wrong temperature", "overbaking"]
            }
        }
    
    async def analyze_recipe(self, recipe_text: str, analysis_type: str = "general") -> Dict[str, Any]:
        """
        Analyze a recipe and provide detailed insights
        
        Args:
            recipe_text: The recipe text to analyze
            analysis_type: Type of analysis (general, ingredients, techniques, etc.)
        
        Returns:
            Dictionary containing analysis results
        """
        logger.info(f"🔍 Analyzing recipe: {analysis_type}")
        
        try:
            # Parse recipe components
            parsed_recipe = await self._parse_recipe(recipe_text)
            
            # Perform analysis based on type
            if analysis_type == "general":
                analysis = await self._general_recipe_analysis(parsed_recipe)
            elif analysis_type == "ingredients":
                analysis = await self._ingredient_analysis(parsed_recipe)
            elif analysis_type == "techniques":
                analysis = await self._technique_analysis(parsed_recipe)
            elif analysis_type == "nutrition":
                analysis = await self._nutritional_analysis(parsed_recipe)
            else:
                analysis = await self._general_recipe_analysis(parsed_recipe)
            
            return analysis
            
        except Exception as e:
            logger.error(f"❌ Error analyzing recipe: {str(e)}")
            raise
    
    async def _parse_recipe(self, recipe_text: str) -> Dict[str, Any]:
        """Parse recipe text into structured components"""
        parsed = {
            "ingredients": [],
            "instructions": [],
            "cooking_time": None,
            "difficulty": "intermediate",
            "cuisine_type": "general",
            "dietary_info": []
        }
        
        # Extract ingredients
        ingredients_match = re.search(r"ingredients?:(.*?)(?=instructions?|directions?|steps?|$)", 
                                    recipe_text, re.IGNORECASE | re.DOTALL)
        if ingredients_match:
            ingredients_text = ingredients_match.group(1).strip()
            parsed["ingredients"] = self._parse_ingredients(ingredients_text)
        
        # Extract instructions
        instructions_match = re.search(r"instructions?|directions?|steps?:(.*?)(?=servings?|yield|$)", 
                                     recipe_text, re.IGNORECASE | re.DOTALL)
        if instructions_match:
            instructions_text = instructions_match.group(1).strip()
            parsed["instructions"] = self._parse_instructions(instructions_text)
        
        # Extract cooking time
        time_match = re.search(r"(\d+)\s*(?:minutes?|mins?|hours?|hrs?)", recipe_text, re.IGNORECASE)
        if time_match:
            parsed["cooking_time"] = time_match.group(0)
        
        # Determine difficulty based on complexity
        parsed["difficulty"] = self._determine_difficulty(parsed)
        
        # Determine cuisine type
        parsed["cuisine_type"] = self._determine_cuisine_type(recipe_text)
        
        # Extract dietary information
        parsed["dietary_info"] = self._extract_dietary_info(recipe_text)
        
        return parsed
    
    def _parse_ingredients(self, ingredients_text: str) -> List[Dict[str, Any]]:
        """Parse ingredients text into structured format"""
        ingredients = []
        lines = ingredients_text.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Try to match ingredient patterns
            for pattern in self.recipe_patterns["ingredients"]:
                match = re.match(pattern, line, re.IGNORECASE)
                if match:
                    if len(match.groups()) == 3:
                        amount, unit, name = match.groups()
                        ingredients.append({
                            "amount": float(amount) if amount else None,
                            "unit": unit.lower(),
                            "name": name.strip(),
                            "original": line
                        })
                    elif len(match.groups()) == 2:
                        amount, name = match.groups()
                        ingredients.append({
                            "amount": float(amount) if amount else None,
                            "unit": None,
                            "name": name.strip(),
                            "original": line
                        })
                    break
            else:
                # No pattern matched, treat as ingredient name only
                ingredients.append({
                    "amount": None,
                    "unit": None,
                    "name": line,
                    "original": line
                })
        
        return ingredients
    
    def _parse_instructions(self, instructions_text: str) -> List[str]:
        """Parse instructions text into steps"""
        instructions = []
        lines = instructions_text.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Remove step numbers and clean up
            line = re.sub(r'^\d+\.\s*', '', line)
            line = re.sub(r'^Step\s+\d+:\s*', '', line)
            
            if line:
                instructions.append(line)
        
        return instructions
    
    def _determine_difficulty(self, parsed_recipe: Dict[str, Any]) -> str:
        """Determine recipe difficulty based on various factors"""
        score = 0
        
        # Factor in number of ingredients
        if len(parsed_recipe["ingredients"]) > 15:
            score += 2
        elif len(parsed_recipe["ingredients"]) > 10:
            score += 1
        
        # Factor in number of instructions
        if len(parsed_recipe["instructions"]) > 10:
            score += 2
        elif len(parsed_recipe["instructions"]) > 5:
            score += 1
        
        # Factor in cooking time
        if parsed_recipe["cooking_time"]:
            time_match = re.search(r'(\d+)', parsed_recipe["cooking_time"])
            if time_match:
                minutes = int(time_match.group(1))
                if minutes > 60:
                    score += 1
        
        # Determine difficulty based on score
        if score >= 4:
            return "expert"
        elif score >= 2:
            return "advanced"
        elif score >= 1:
            return "intermediate"
        else:
            return "beginner"
    
    def _determine_cuisine_type(self, recipe_text: str) -> str:
        """Determine cuisine type based on ingredients and terminology"""
        text_lower = recipe_text.lower()
        
        cuisine_keywords = {
            "italian": ["pasta", "basil", "oregano", "parmesan", "olive oil", "tomato"],
            "french": ["butter", "wine", "shallots", "herbs de provence", "dijon"],
            "chinese": ["soy sauce", "ginger", "sesame oil", "rice wine", "five spice"],
            "japanese": ["miso", "dashi", "mirin", "sake", "wasabi", "nori"],
            "indian": ["curry", "cumin", "turmeric", "cardamom", "garam masala"],
            "mexican": ["chili", "lime", "cilantro", "tortilla", "queso", "salsa"]
        }
        
        for cuisine, keywords in cuisine_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                return cuisine
        
        return "general"
    
    def _extract_dietary_info(self, recipe_text: str) -> List[str]:
        """Extract dietary information from recipe text"""
        text_lower = recipe_text.lower()
        dietary_info = []
        
        dietary_keywords = {
            "vegetarian": ["vegetarian", "veggie", "no meat"],
            "vegan": ["vegan", "plant-based", "no dairy"],
            "gluten-free": ["gluten-free", "gluten free", "gf"],
            "dairy-free": ["dairy-free", "dairy free", "lactose-free"],
            "low-carb": ["low-carb", "low carb", "keto"],
            "healthy": ["healthy", "light", "low-fat"]
        }
        
        for diet, keywords in dietary_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                dietary_info.append(diet)
        
        return dietary_info
    
    async def _general_recipe_analysis(self, parsed_recipe: Dict[str, Any]) -> Dict[str, Any]:
        """Perform general recipe analysis"""
        analysis = {
            "summary": f"This is a {parsed_recipe['difficulty']} level {parsed_recipe['cuisine_type']} recipe",
            "ingredients_count": len(parsed_recipe["ingredients"]),
            "steps_count": len(parsed_recipe["instructions"]),
            "estimated_time": parsed_recipe["cooking_time"] or "Not specified",
            "difficulty": parsed_recipe["difficulty"],
            "cuisine_type": parsed_recipe["cuisine_type"],
            "dietary_info": parsed_recipe["dietary_info"],
            "suggestions": [],
            "tips": []
        }
        
        # Generate suggestions based on analysis
        if len(parsed_recipe["ingredients"]) > 15:
            analysis["suggestions"].append("Consider breaking this into smaller recipes or meal prep")
        
        if len(parsed_recipe["instructions"]) > 10:
            analysis["suggestions"].append("This recipe has many steps - consider prepping ingredients ahead")
        
        if not parsed_recipe["cooking_time"]:
            analysis["suggestions"].append("Add cooking time for better meal planning")
        
        # Add cooking tips
        analysis["tips"].extend([
            "Read through all instructions before starting",
            "Prep all ingredients before beginning",
            "Taste as you cook and adjust seasoning"
        ])
        
        return analysis
    
    async def _ingredient_analysis(self, parsed_recipe: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze recipe ingredients"""
        analysis = {
            "ingredients": [],
            "substitutions": [],
            "shopping_list": [],
            "storage_tips": []
        }
        
        for ingredient in parsed_recipe["ingredients"]:
            ingredient_info = {
                "name": ingredient["name"],
                "amount": ingredient["amount"],
                "unit": ingredient["unit"],
                "info": self.ingredient_database.get(ingredient["name"].lower(), {}),
                "substitutes": []
            }
            
            # Get substitutes from database
            if ingredient_info["info"]:
                ingredient_info["substitutes"] = ingredient_info["info"].get("substitutes", [])
                analysis["substitutions"].extend(ingredient_info["substitutes"])
            
            analysis["ingredients"].append(ingredient_info)
            analysis["shopping_list"].append(ingredient["original"])
        
        return analysis
    
    async def _technique_analysis(self, parsed_recipe: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze cooking techniques used in recipe"""
        analysis = {
            "techniques": [],
            "equipment_needed": [],
            "skill_requirements": []
        }
        
        # Analyze instructions for cooking techniques
        for instruction in parsed_recipe["instructions"]:
            instruction_lower = instruction.lower()
            
            for technique_name, technique_info in self.technique_database.items():
                if technique_name in instruction_lower:
                    analysis["techniques"].append({
                        "name": technique_name,
                        "description": technique_info["description"],
                        "tips": technique_info["tips"],
                        "equipment": technique_info["equipment"]
                    })
                    analysis["equipment_needed"].extend(technique_info["equipment"])
        
        return analysis
    
    async def _nutritional_analysis(self, parsed_recipe: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze nutritional content of recipe"""
        analysis = {
            "estimated_nutrition": {
                "calories": 0,
                "protein": 0,
                "carbs": 0,
                "fat": 0,
                "fiber": 0
            },
            "ingredient_breakdown": [],
            "health_notes": []
        }
        
        # Calculate estimated nutrition based on ingredients
        for ingredient in parsed_recipe["ingredients"]:
            ingredient_info = self.ingredient_database.get(ingredient["name"].lower(), {})
            if ingredient_info and "nutrition" in ingredient_info:
                nutrition = ingredient_info["nutrition"]
                amount = ingredient["amount"] or 1
                
                # Simple calculation (in real implementation, would be more sophisticated)
                for nutrient, value in nutrition.items():
                    if nutrient in analysis["estimated_nutrition"]:
                        analysis["estimated_nutrition"][nutrient] += value * amount
        
        return analysis
    
    async def get_recipe_suggestions(self, context: Optional[Dict[str, Any]] = None, 
                                   user_preferences: Optional[Dict[str, Any]] = None) -> List[str]:
        """Get personalized recipe suggestions"""
        suggestions = []
        
        # Generate suggestions based on context and preferences
        if context and "available_ingredients" in context:
            ingredients = context["available_ingredients"]
            suggestions.append(f"Try a recipe using {', '.join(ingredients[:3])}")
        
        if user_preferences and "dietary_restrictions" in user_preferences:
            restrictions = user_preferences["dietary_restrictions"]
            suggestions.append(f"Explore {restrictions[0]} recipes")
        
        # Add general suggestions
        suggestions.extend([
            "Try a quick 30-minute meal",
            "Explore seasonal ingredients",
            "Consider meal prep for the week"
        ])
        
        return suggestions[:5]  # Return top 5 suggestions

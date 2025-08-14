#!/usr/bin/env python3
"""
🍳 Cooking Chat Interface - Specialized Chat for Cooking Ethos AI

This module handles cooking-focused conversations, providing expert advice on
food, recipes, ingredients, and culinary techniques.
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

class CookingChatInterface:
    """
    Specialized chat interface for cooking-related conversations.
    
    This class handles:
    - Cooking-focused conversations
    - Recipe advice and suggestions
    - Ingredient questions and substitutions
    - Cooking technique guidance
    - Food safety information
    - Nutritional advice
    """
    
    def __init__(self):
        self.models = CookingModels()
        self.is_initialized = False
        self.conversation_history = []
        self.cooking_context = {}
        self.user_preferences = {}
        
        # Cooking-specific conversation patterns
        self.cooking_patterns = {
            "recipe_questions": [
                r"how.*cook.*",
                r"recipe.*for.*",
                r"how.*make.*",
                r"what.*ingredients.*",
                r"substitute.*for.*"
            ],
            "technique_questions": [
                r"how.*(sauté|bake|grill|fry|boil|steam|roast)",
                r"what.*temperature.*",
                r"how.*long.*cook.*",
                r"technique.*for.*"
            ],
            "ingredient_questions": [
                r"what.*is.*",
                r"substitute.*",
                r"alternative.*to.*",
                r"where.*buy.*",
                r"how.*store.*"
            ],
            "safety_questions": [
                r"safe.*to.*eat.*",
                r"food.*poisoning.*",
                r"expired.*",
                r"temperature.*danger.*"
            ]
        }
        
        # Cooking knowledge base
        self.cooking_knowledge = {
            "basic_techniques": {
                "sautéing": "Quick cooking over high heat with minimal oil",
                "baking": "Cooking with dry heat in an enclosed space",
                "grilling": "Cooking over direct heat from below",
                "frying": "Cooking in hot oil or fat",
                "boiling": "Cooking in liquid at 100°C (212°F)",
                "steaming": "Cooking with steam from boiling water"
            },
            "common_substitutions": {
                "butter": ["olive oil", "coconut oil", "applesauce"],
                "eggs": ["flax eggs", "chia eggs", "banana"],
                "milk": ["almond milk", "soy milk", "oat milk"],
                "flour": ["almond flour", "coconut flour", "oat flour"],
                "sugar": ["honey", "maple syrup", "stevia"]
            },
            "food_safety": {
                "meat_temperature": {
                    "beef": "145°F (63°C)",
                    "pork": "145°F (63°C)",
                    "chicken": "165°F (74°C)",
                    "fish": "145°F (63°C)"
                },
                "storage_times": {
                    "leftovers": "3-4 days in refrigerator",
                    "cooked_meat": "3-4 days in refrigerator",
                    "raw_meat": "1-2 days in refrigerator"
                }
            }
        }
    
    async def initialize(self):
        """Initialize the cooking chat interface"""
        logger.info("💬 Initializing Cooking Chat Interface...")
        
        try:
            # Load cooking models
            await self.models.load_models()
            
            # Load cooking knowledge
            await self._load_cooking_knowledge()
            
            # Initialize conversation context
            self.conversation_history = []
            self.cooking_context = {}
            self.user_preferences = {}
            
            self.is_initialized = True
            logger.info("✅ Cooking Chat Interface initialized successfully!")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Cooking Chat Interface: {str(e)}")
            raise
    
    async def cleanup(self):
        """Cleanup resources"""
        logger.info("🧹 Cleaning up Cooking Chat Interface...")
        
        try:
            # Cleanup models
            await self.models.cleanup()
            
            # Clear conversation data
            self.conversation_history.clear()
            self.cooking_context.clear()
            self.user_preferences.clear()
            
            self.is_initialized = False
            logger.info("✅ Cooking Chat Interface cleanup complete!")
            
        except Exception as e:
            logger.error(f"❌ Error during Cooking Chat Interface cleanup: {str(e)}")
    
    def is_ready(self) -> bool:
        """Check if the cooking chat interface is ready"""
        return self.is_initialized and self.models.is_ready()
    
    async def _load_cooking_knowledge(self):
        """Load cooking knowledge for chat responses"""
        logger.info("📚 Loading cooking knowledge for chat...")
        
        # Load additional cooking knowledge from files
        knowledge_files = [
            "data/cooking_conversations.json",
            "data/recipe_advice.json",
            "data/ingredient_qa.json",
            "data/technique_guidance.json"
        ]
        
        for file_path in knowledge_files:
            try:
                if os.path.exists(file_path):
                    with open(file_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        self.cooking_knowledge.update(data)
                        logger.info(f"✅ Loaded {file_path}")
                else:
                    logger.warning(f"⚠️ Knowledge file not found: {file_path}")
            except Exception as e:
                logger.error(f"❌ Error loading {file_path}: {str(e)}")
    
    async def process_message(self, message: str, context: Optional[Dict[str, Any]] = None,
                            user_preferences: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Process a cooking-related message and generate a response
        
        Args:
            message: User's cooking-related question or message
            context: Additional context (recipe, ingredients, etc.)
            user_preferences: User's cooking preferences
        
        Returns:
            Dictionary containing response and additional information
        """
        logger.info(f"💬 Processing cooking message: {message[:50]}...")
        
        try:
            # Update context and preferences
            if context:
                self.cooking_context.update(context)
            if user_preferences:
                self.user_preferences.update(user_preferences)
            
            # Add message to conversation history
            self.conversation_history.append({
                "role": "user",
                "content": message,
                "timestamp": datetime.now().isoformat()
            })
            
            # Analyze message type
            message_type = self._analyze_message_type(message)
            
            # Generate response based on message type
            if message_type == "recipe_question":
                response = await self._handle_recipe_question(message)
            elif message_type == "technique_question":
                response = await self._handle_technique_question(message)
            elif message_type == "ingredient_question":
                response = await self._handle_ingredient_question(message)
            elif message_type == "safety_question":
                response = await self._handle_safety_question(message)
            else:
                response = await self._handle_general_cooking_question(message)
            
            # Add response to conversation history
            self.conversation_history.append({
                "role": "assistant",
                "content": response["response"],
                "timestamp": datetime.now().isoformat()
            })
            
            return response
            
        except Exception as e:
            logger.error(f"❌ Error processing cooking message: {str(e)}")
            return {
                "response": "I'm sorry, I'm having trouble processing your cooking question right now. Please try again!",
                "suggestions": ["Ask about a specific recipe", "Ask about cooking techniques", "Ask about ingredients"],
                "confidence": 0.0,
                "related_topics": ["cooking basics", "recipe help", "ingredient information"]
            }
    
    def _analyze_message_type(self, message: str) -> str:
        """Analyze the type of cooking question being asked"""
        message_lower = message.lower()
        
        # Check for recipe-related questions
        for pattern in self.cooking_patterns["recipe_questions"]:
            if re.search(pattern, message_lower):
                return "recipe_question"
        
        # Check for technique-related questions
        for pattern in self.cooking_patterns["technique_questions"]:
            if re.search(pattern, message_lower):
                return "technique_question"
        
        # Check for ingredient-related questions
        for pattern in self.cooking_patterns["ingredient_questions"]:
            if re.search(pattern, message_lower):
                return "ingredient_question"
        
        # Check for safety-related questions
        for pattern in self.cooking_patterns["safety_questions"]:
            if re.search(pattern, message_lower):
                return "safety_question"
        
        return "general_cooking"
    
    async def _handle_recipe_question(self, message: str) -> Dict[str, Any]:
        """Handle recipe-related questions"""
        message_lower = message.lower()
        
        # Extract recipe-related keywords
        recipe_keywords = self._extract_recipe_keywords(message)
        
        # Generate recipe-focused response
        if "how to cook" in message_lower or "how to make" in message_lower:
            food_item = self._extract_food_item(message)
            response = f"To cook {food_item}, here's a basic approach:\n\n"
            response += await self._get_cooking_instructions(food_item)
            
            suggestions = [
                f"Try different seasonings for {food_item}",
                f"Explore various cooking methods for {food_item}",
                "Consider pairing with complementary ingredients"
            ]
            
        elif "recipe for" in message_lower:
            food_item = self._extract_food_item(message)
            response = f"Here's a simple recipe for {food_item}:\n\n"
            response += await self._get_recipe_suggestion(food_item)
            
            suggestions = [
                f"Try variations of this {food_item} recipe",
                "Adjust seasoning to your taste",
                "Consider serving with side dishes"
            ]
            
        else:
            response = "I'd be happy to help you with recipe questions! Could you be more specific about what you'd like to cook?"
            suggestions = [
                "Ask about a specific dish",
                "Ask about cooking techniques",
                "Ask about ingredient substitutions"
            ]
        
        return {
            "response": response,
            "suggestions": suggestions,
            "confidence": 0.85,
            "related_topics": ["cooking techniques", "ingredient preparation", "recipe variations"]
        }
    
    async def _handle_technique_question(self, message: str) -> Dict[str, Any]:
        """Handle cooking technique questions"""
        message_lower = message.lower()
        
        # Extract technique keywords
        technique = self._extract_cooking_technique(message)
        
        if technique and technique in self.cooking_knowledge["basic_techniques"]:
            description = self.cooking_knowledge["basic_techniques"][technique]
            response = f"**{technique.title()}** is {description}.\n\n"
            response += await self._get_technique_instructions(technique)
            
            suggestions = [
                f"Practice {technique} with simple ingredients",
                "Start with low heat and adjust as needed",
                "Use the right equipment for best results"
            ]
            
        else:
            response = "I can help you with various cooking techniques! Which specific technique would you like to learn about?"
            suggestions = [
                "Ask about sautéing",
                "Ask about baking",
                "Ask about grilling",
                "Ask about boiling"
            ]
        
        return {
            "response": response,
            "suggestions": suggestions,
            "confidence": 0.90,
            "related_topics": ["cooking methods", "equipment", "temperature control"]
        }
    
    async def _handle_ingredient_question(self, message: str) -> Dict[str, Any]:
        """Handle ingredient-related questions"""
        message_lower = message.lower()
        
        # Extract ingredient keywords
        ingredient = self._extract_ingredient(message)
        
        if "substitute" in message_lower or "alternative" in message_lower:
            if ingredient and ingredient in self.cooking_knowledge["common_substitutions"]:
                substitutes = self.cooking_knowledge["common_substitutions"][ingredient]
                response = f"For {ingredient}, you can substitute with:\n"
                for sub in substitutes:
                    response += f"• {sub}\n"
                
                suggestions = [
                    "Consider the flavor profile when substituting",
                    "Adjust quantities based on the substitute",
                    "Test small batches first"
                ]
            else:
                response = "I can help you find ingredient substitutes! What ingredient are you looking to replace?"
                suggestions = [
                    "Ask about butter substitutes",
                    "Ask about egg substitutes",
                    "Ask about flour substitutes"
                ]
        
        elif "what is" in message_lower:
            if ingredient:
                response = f"**{ingredient.title()}** is a common ingredient used in cooking. "
                response += await self._get_ingredient_description(ingredient)
                
                suggestions = [
                    f"Learn how to use {ingredient} in recipes",
                    f"Find substitutes for {ingredient}",
                    f"Discover recipes featuring {ingredient}"
                ]
            else:
                response = "I can tell you about various ingredients! Which ingredient would you like to know more about?"
                suggestions = [
                    "Ask about specific ingredients",
                    "Ask about ingredient properties",
                    "Ask about ingredient storage"
                ]
        
        else:
            response = "I can help you with ingredient questions! What would you like to know about ingredients?"
            suggestions = [
                "Ask about ingredient substitutes",
                "Ask about ingredient properties",
                "Ask about ingredient storage"
            ]
        
        return {
            "response": response,
            "suggestions": suggestions,
            "confidence": 0.88,
            "related_topics": ["ingredient properties", "substitutions", "storage tips"]
        }
    
    async def _handle_safety_question(self, message: str) -> Dict[str, Any]:
        """Handle food safety questions"""
        message_lower = message.lower()
        
        if "temperature" in message_lower:
            food_item = self._extract_food_item(message)
            if food_item and food_item in self.cooking_knowledge["food_safety"]["meat_temperature"]:
                temp = self.cooking_knowledge["food_safety"]["meat_temperature"][food_item]
                response = f"For {food_item}, the safe internal temperature is **{temp}**. "
                response += "Use a food thermometer to check the temperature in the thickest part."
                
                suggestions = [
                    "Always use a food thermometer",
                    "Let meat rest after cooking",
                    "Check multiple spots for temperature"
                ]
            else:
                response = "Food safety is crucial! Here are general temperature guidelines:\n\n"
                response += "• Beef, Pork, Lamb: 145°F (63°C)\n"
                response += "• Poultry: 165°F (74°C)\n"
                response += "• Fish: 145°F (63°C)\n"
                response += "• Ground Meat: 160°F (71°C)"
                
                suggestions = [
                    "Invest in a good food thermometer",
                    "Learn about food safety guidelines",
                    "When in doubt, cook longer"
                ]
        
        elif "expired" in message_lower or "spoiled" in message_lower:
            response = "**When in doubt, throw it out!** This is the golden rule of food safety. "
            response += "If you're unsure about food safety, it's better to be safe than sorry. "
            response += "Look for signs of spoilage like unusual odors, colors, or textures."
            
            suggestions = [
                "Learn food storage guidelines",
                "Check expiration dates regularly",
                "When in doubt, discard the food"
            ]
        
        else:
            response = "Food safety is essential! I can help you with:\n\n"
            response += "• Safe cooking temperatures\n"
            response += "• Food storage guidelines\n"
            response += "• Signs of food spoilage\n"
            response += "• Food handling best practices"
            
            suggestions = [
                "Ask about cooking temperatures",
                "Ask about food storage",
                "Ask about food spoilage signs"
            ]
        
        return {
            "response": response,
            "suggestions": suggestions,
            "confidence": 0.95,
            "related_topics": ["food safety", "cooking temperatures", "food storage"]
        }
    
    async def _handle_general_cooking_question(self, message: str) -> Dict[str, Any]:
        """Handle general cooking questions"""
        response = "I'm here to help with all your cooking questions! I can assist with:\n\n"
        response += "• **Recipes**: How to cook specific dishes\n"
        response += "• **Techniques**: Cooking methods and skills\n"
        response += "• **Ingredients**: Substitutions and properties\n"
        response += "• **Safety**: Food safety guidelines\n"
        response += "• **Tips**: Cooking advice and best practices\n\n"
        response += "What would you like to know about cooking?"
        
        suggestions = [
            "Ask about a specific recipe",
            "Ask about cooking techniques",
            "Ask about ingredient substitutions",
            "Ask about food safety"
        ]
        
        return {
            "response": response,
            "suggestions": suggestions,
            "confidence": 0.80,
            "related_topics": ["cooking basics", "recipe help", "cooking tips"]
        }
    
    def _extract_recipe_keywords(self, message: str) -> List[str]:
        """Extract recipe-related keywords from message"""
        keywords = []
        recipe_words = ["cook", "make", "recipe", "ingredients", "instructions", "steps"]
        
        for word in recipe_words:
            if word in message.lower():
                keywords.append(word)
        
        return keywords
    
    def _extract_food_item(self, message: str) -> str:
        """Extract food item from message"""
        # Simple extraction - in a real implementation, this would be more sophisticated
        food_items = ["chicken", "beef", "pork", "fish", "pasta", "rice", "vegetables", "soup", "salad"]
        
        for food in food_items:
            if food in message.lower():
                return food
        
        return "this dish"
    
    def _extract_cooking_technique(self, message: str) -> str:
        """Extract cooking technique from message"""
        techniques = list(self.cooking_knowledge["basic_techniques"].keys())
        
        for technique in techniques:
            if technique in message.lower():
                return technique
        
        return ""
    
    def _extract_ingredient(self, message: str) -> str:
        """Extract ingredient from message"""
        # Simple extraction - in a real implementation, this would be more sophisticated
        ingredients = list(self.cooking_knowledge["common_substitutions"].keys())
        
        for ingredient in ingredients:
            if ingredient in message.lower():
                return ingredient
        
        return ""
    
    async def _get_cooking_instructions(self, food_item: str) -> str:
        """Get basic cooking instructions for a food item"""
        instructions = {
            "chicken": "1. Season with salt and pepper\n2. Heat oil in a pan over medium heat\n3. Cook for 6-8 minutes per side\n4. Check internal temperature reaches 165°F",
            "beef": "1. Season with salt and pepper\n2. Heat oil in a pan over high heat\n3. Sear for 2-3 minutes per side\n4. Cook to desired doneness",
            "pasta": "1. Bring water to boil\n2. Add salt to water\n3. Cook pasta according to package directions\n4. Drain and serve",
            "rice": "1. Rinse rice until water runs clear\n2. Add rice and water to pot (1:2 ratio)\n3. Bring to boil, then reduce heat\n4. Simmer covered for 18-20 minutes"
        }
        
        return instructions.get(food_item, "Follow recipe instructions and adjust seasoning to taste.")
    
    async def _get_recipe_suggestion(self, food_item: str) -> str:
        """Get a simple recipe suggestion for a food item"""
        recipes = {
            "chicken": "**Simple Pan-Seared Chicken**\n\nIngredients:\n• 2 chicken breasts\n• Salt and pepper\n• 2 tbsp olive oil\n• 2 cloves garlic\n\nInstructions:\n1. Season chicken with salt and pepper\n2. Heat oil in pan over medium-high heat\n3. Add chicken and cook 6-8 minutes per side\n4. Add garlic in last 2 minutes\n5. Rest 5 minutes before serving",
            "pasta": "**Quick Garlic Pasta**\n\nIngredients:\n• 8 oz pasta\n• 3 cloves garlic\n• 2 tbsp olive oil\n• Salt and pepper\n• Parmesan cheese\n\nInstructions:\n1. Cook pasta according to package\n2. Heat oil and sauté garlic\n3. Toss pasta with garlic oil\n4. Season and top with cheese"
        }
        
        return recipes.get(food_item, f"Try a simple {food_item} recipe with basic seasonings and your favorite cooking method.")
    
    async def _get_technique_instructions(self, technique: str) -> str:
        """Get detailed instructions for a cooking technique"""
        instructions = {
            "sautéing": "**How to Sauté:**\n\n1. Heat oil in a pan over medium-high heat\n2. Add ingredients in small batches\n3. Stir frequently to prevent burning\n4. Cook until desired doneness\n\n**Tips:**\n• Don't overcrowd the pan\n• Use high smoke point oils\n• Keep ingredients moving",
            "baking": "**How to Bake:**\n\n1. Preheat oven to specified temperature\n2. Prepare ingredients and pan\n3. Place in oven and bake for specified time\n4. Check for doneness\n\n**Tips:**\n• Always preheat the oven\n• Use the correct pan size\n• Don't open the oven too often"
        }
        
        return instructions.get(technique, f"Research {technique} techniques and practice with simple recipes.")
    
    async def _get_ingredient_description(self, ingredient: str) -> str:
        """Get description of an ingredient"""
        descriptions = {
            "butter": "a dairy product made from churned cream, used for cooking, baking, and flavoring",
            "eggs": "a versatile ingredient used for binding, leavening, and adding richness to dishes",
            "flour": "a powder made from ground grains, used as the base for many baked goods and sauces",
            "olive oil": "a healthy fat extracted from olives, used for cooking and dressing"
        }
        
        return descriptions.get(ingredient, f"a common ingredient used in various recipes and cooking techniques.")
    
    def get_conversation_history(self) -> List[Dict[str, Any]]:
        """Get conversation history"""
        return self.conversation_history.copy()
    
    def clear_conversation_history(self):
        """Clear conversation history"""
        self.conversation_history.clear()
        logger.info("🗑️ Conversation history cleared")

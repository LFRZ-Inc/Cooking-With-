#!/usr/bin/env python3
"""
🍳 Cooking Knowledge Base - Culinary Knowledge Management for Cooking Ethos AI

This module manages comprehensive cooking knowledge including ingredients,
techniques, recipes, and culinary information.
"""

import os
import json
import logging
import asyncio
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime
import sqlite3
from pathlib import Path

logger = logging.getLogger(__name__)

class CookingKnowledgeBase:
    """
    Manages comprehensive cooking knowledge and data.
    
    This class handles:
    - Ingredient information and properties
    - Cooking techniques and methods
    - Recipe analysis and categorization
    - Nutritional data and dietary information
    - Cuisine knowledge and traditions
    - Food safety guidelines
    - Equipment and tools information
    """
    
    def __init__(self):
        self.is_initialized = False
        self.db_path = "data/cooking_knowledge.db"
        self.knowledge_data = {}
        
        # Knowledge categories
        self.categories = {
            "ingredients": {},
            "techniques": {},
            "cuisines": {},
            "equipment": {},
            "nutrition": {},
            "safety": {},
            "recipes": {},
            "substitutions": {}
        }
    
    async def initialize(self):
        """Initialize the cooking knowledge base"""
        logger.info("📚 Initializing Cooking Knowledge Base...")
        
        try:
            # Create data directory if it doesn't exist
            os.makedirs("data", exist_ok=True)
            
            # Initialize database
            await self._initialize_database()
            
            # Load knowledge data
            await self._load_knowledge_data()
            
            # Load cooking databases
            await self._load_ingredient_database()
            await self._load_technique_database()
            await self._load_cuisine_database()
            await self._load_equipment_database()
            await self._load_nutrition_database()
            await self._load_safety_database()
            
            self.is_initialized = True
            logger.info("✅ Cooking Knowledge Base initialized successfully!")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Cooking Knowledge Base: {str(e)}")
            raise
    
    async def cleanup(self):
        """Cleanup knowledge base resources"""
        logger.info("🧹 Cleaning up Cooking Knowledge Base...")
        
        try:
            # Clear knowledge data
            self.knowledge_data.clear()
            for category in self.categories:
                self.categories[category].clear()
            
            self.is_initialized = False
            logger.info("✅ Cooking Knowledge Base cleanup complete!")
            
        except Exception as e:
            logger.error(f"❌ Error during Cooking Knowledge Base cleanup: {str(e)}")
    
    def is_ready(self) -> bool:
        """Check if the knowledge base is ready"""
        return self.is_initialized
    
    async def _initialize_database(self):
        """Initialize SQLite database for cooking knowledge"""
        logger.info("🗄️ Initializing cooking knowledge database...")
        
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Create tables
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS ingredients (
                    id INTEGER PRIMARY KEY,
                    name TEXT UNIQUE NOT NULL,
                    category TEXT,
                    description TEXT,
                    substitutes TEXT,
                    storage_tips TEXT,
                    cooking_tips TEXT,
                    nutritional_info TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS cooking_techniques (
                    id INTEGER PRIMARY KEY,
                    name TEXT UNIQUE NOT NULL,
                    description TEXT,
                    steps TEXT,
                    tips TEXT,
                    equipment TEXT,
                    common_mistakes TEXT,
                    suitable_foods TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS cuisines (
                    id INTEGER PRIMARY KEY,
                    name TEXT UNIQUE NOT NULL,
                    description TEXT,
                    key_ingredients TEXT,
                    signature_flavors TEXT,
                    traditional_dishes TEXT,
                    cooking_methods TEXT,
                    cultural_background TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS equipment (
                    id INTEGER PRIMARY KEY,
                    name TEXT UNIQUE NOT NULL,
                    category TEXT,
                    description TEXT,
                    usage_instructions TEXT,
                    care_maintenance TEXT,
                    safety_tips TEXT,
                    alternatives TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS food_safety (
                    id INTEGER PRIMARY KEY,
                    food_type TEXT UNIQUE NOT NULL,
                    safe_temperature TEXT,
                    storage_guidelines TEXT,
                    shelf_life TEXT,
                    spoilage_signs TEXT,
                    handling_tips TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()
            conn.close()
            
            logger.info("✅ Database initialized successfully!")
            
        except Exception as e:
            logger.error(f"❌ Error initializing database: {str(e)}")
            raise
    
    async def _load_knowledge_data(self):
        """Load cooking knowledge from data files"""
        logger.info("📖 Loading cooking knowledge data...")
        
        # Load knowledge files
        knowledge_files = [
            "data/ingredients.json",
            "data/techniques.json",
            "data/cuisines.json",
            "data/equipment.json",
            "data/nutrition.json",
            "data/safety.json",
            "data/substitutions.json"
        ]
        
        for file_path in knowledge_files:
            try:
                if os.path.exists(file_path):
                    with open(file_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        category = os.path.basename(file_path).replace('.json', '')
                        self.knowledge_data[category] = data
                        logger.info(f"✅ Loaded {file_path}")
                else:
                    logger.warning(f"⚠️ Knowledge file not found: {file_path}")
                    # Create basic data for missing files
                    self._create_basic_knowledge_data(file_path)
            except Exception as e:
                logger.error(f"❌ Error loading {file_path}: {str(e)}")
                self._create_basic_knowledge_data(file_path)
    
    def _create_basic_knowledge_data(self, file_path: str):
        """Create basic knowledge data for missing files"""
        category = os.path.basename(file_path).replace('.json', '')
        
        if category == "ingredients":
            self.knowledge_data[category] = self._get_basic_ingredients()
        elif category == "techniques":
            self.knowledge_data[category] = self._get_basic_techniques()
        elif category == "cuisines":
            self.knowledge_data[category] = self._get_basic_cuisines()
        elif category == "equipment":
            self.knowledge_data[category] = self._get_basic_equipment()
        elif category == "nutrition":
            self.knowledge_data[category] = self._get_basic_nutrition()
        elif category == "safety":
            self.knowledge_data[category] = self._get_basic_safety()
        elif category == "substitutions":
            self.knowledge_data[category] = self._get_basic_substitutions()
        
        logger.info(f"✅ Created basic {category} data")
    
    async def _load_ingredient_database(self):
        """Load ingredient database"""
        logger.info("🥕 Loading ingredient database...")
        
        ingredients = self.knowledge_data.get("ingredients", {})
        for ingredient_name, ingredient_data in ingredients.items():
            self.categories["ingredients"][ingredient_name.lower()] = ingredient_data
        
        logger.info(f"✅ Loaded {len(self.categories['ingredients'])} ingredients")
    
    async def _load_technique_database(self):
        """Load cooking technique database"""
        logger.info("👨‍🍳 Loading cooking technique database...")
        
        techniques = self.knowledge_data.get("techniques", {})
        for technique_name, technique_data in techniques.items():
            self.categories["techniques"][technique_name.lower()] = technique_data
        
        logger.info(f"✅ Loaded {len(self.categories['techniques'])} techniques")
    
    async def _load_cuisine_database(self):
        """Load cuisine database"""
        logger.info("🌍 Loading cuisine database...")
        
        cuisines = self.knowledge_data.get("cuisines", {})
        for cuisine_name, cuisine_data in cuisines.items():
            self.categories["cuisines"][cuisine_name.lower()] = cuisine_data
        
        logger.info(f"✅ Loaded {len(self.categories['cuisines'])} cuisines")
    
    async def _load_equipment_database(self):
        """Load equipment database"""
        logger.info("🔧 Loading equipment database...")
        
        equipment = self.knowledge_data.get("equipment", {})
        for equipment_name, equipment_data in equipment.items():
            self.categories["equipment"][equipment_name.lower()] = equipment_data
        
        logger.info(f"✅ Loaded {len(self.categories['equipment'])} equipment items")
    
    async def _load_nutrition_database(self):
        """Load nutrition database"""
        logger.info("🥗 Loading nutrition database...")
        
        nutrition = self.knowledge_data.get("nutrition", {})
        for food_item, nutrition_data in nutrition.items():
            self.categories["nutrition"][food_item.lower()] = nutrition_data
        
        logger.info(f"✅ Loaded {len(self.categories['nutrition'])} nutrition items")
    
    async def _load_safety_database(self):
        """Load food safety database"""
        logger.info("🛡️ Loading food safety database...")
        
        safety = self.knowledge_data.get("safety", {})
        for food_type, safety_data in safety.items():
            self.categories["safety"][food_type.lower()] = safety_data
        
        logger.info(f"✅ Loaded {len(self.categories['safety'])} safety guidelines")
    
    async def get_ingredient_info(self, ingredient_name: str) -> Dict[str, Any]:
        """Get detailed information about an ingredient"""
        ingredient_lower = ingredient_name.lower()
        
        if ingredient_lower in self.categories["ingredients"]:
            return self.categories["ingredients"][ingredient_lower]
        
        # Try to find similar ingredients
        similar_ingredients = self._find_similar_ingredients(ingredient_name)
        
        return {
            "name": ingredient_name,
            "description": f"Information about {ingredient_name}",
            "substitutes": similar_ingredients,
            "storage_tips": ["Store in a cool, dry place", "Check expiration date"],
            "cooking_tips": ["Use according to recipe instructions", "Adjust seasoning to taste"],
            "nutritional_info": {"calories": 0, "protein": 0, "carbs": 0, "fat": 0}
        }
    
    async def get_cooking_technique(self, technique_name: str) -> Dict[str, Any]:
        """Get detailed information about a cooking technique"""
        technique_lower = technique_name.lower()
        
        if technique_lower in self.categories["techniques"]:
            return self.categories["techniques"][technique_lower]
        
        # Return basic technique information
        return {
            "name": technique_name,
            "description": f"Information about {technique_name} cooking technique",
            "steps": ["Research the technique", "Practice with simple ingredients", "Follow safety guidelines"],
            "tips": ["Start with basic recipes", "Use proper equipment", "Follow temperature guidelines"],
            "equipment": ["Appropriate cooking vessel", "Heat source", "Safety equipment"],
            "common_mistakes": ["Not following safety guidelines", "Using wrong temperature", "Not practicing enough"]
        }
    
    async def get_cooking_tips(self, category: Optional[str] = None) -> List[str]:
        """Get cooking tips for a specific category or general tips"""
        tips = []
        
        if category:
            category_lower = category.lower()
            if category_lower in self.categories:
                # Get tips from specific category
                for item_name, item_data in self.categories[category_lower].items():
                    if "tips" in item_data:
                        tips.extend(item_data["tips"])
        else:
            # Get general cooking tips
            tips = [
                "Always read through the entire recipe before starting",
                "Prep all ingredients before beginning to cook",
                "Taste as you cook and adjust seasoning",
                "Keep your workspace clean and organized",
                "Use the right tools for the job",
                "Don't be afraid to experiment with flavors",
                "Practice food safety at all times",
                "Learn from your mistakes and keep trying"
            ]
        
        return tips[:10]  # Return top 10 tips
    
    async def search_ingredients(self, query: str) -> List[Dict[str, Any]]:
        """Search for ingredients based on query"""
        results = []
        query_lower = query.lower()
        
        for ingredient_name, ingredient_data in self.categories["ingredients"].items():
            if (query_lower in ingredient_name or 
                query_lower in ingredient_data.get("description", "").lower() or
                query_lower in ingredient_data.get("category", "").lower()):
                results.append({
                    "name": ingredient_name,
                    "data": ingredient_data
                })
        
        return results[:10]  # Return top 10 results
    
    async def get_substitutions(self, ingredient_name: str) -> List[str]:
        """Get substitution options for an ingredient"""
        ingredient_lower = ingredient_name.lower()
        
        # Check direct substitutions
        if ingredient_lower in self.categories["ingredients"]:
            ingredient_data = self.categories["ingredients"][ingredient_lower]
            if "substitutes" in ingredient_data:
                return ingredient_data["substitutes"]
        
        # Check substitution database
        substitutions = self.knowledge_data.get("substitutions", {})
        if ingredient_lower in substitutions:
            return substitutions[ingredient_lower]
        
        # Return common substitutions based on ingredient type
        return self._get_common_substitutions(ingredient_name)
    
    def _find_similar_ingredients(self, ingredient_name: str) -> List[str]:
        """Find similar ingredients"""
        similar = []
        ingredient_lower = ingredient_name.lower()
        
        for name in self.categories["ingredients"].keys():
            if ingredient_lower in name or name in ingredient_lower:
                similar.append(name)
        
        return similar[:5]  # Return top 5 similar ingredients
    
    def _get_common_substitutions(self, ingredient_name: str) -> List[str]:
        """Get common substitutions based on ingredient type"""
        ingredient_lower = ingredient_name.lower()
        
        # Common substitution patterns
        if "butter" in ingredient_lower:
            return ["olive oil", "coconut oil", "applesauce", "avocado"]
        elif "eggs" in ingredient_lower:
            return ["flax eggs", "chia eggs", "banana", "applesauce"]
        elif "milk" in ingredient_lower:
            return ["almond milk", "soy milk", "oat milk", "coconut milk"]
        elif "flour" in ingredient_lower:
            return ["almond flour", "coconut flour", "oat flour", "rice flour"]
        elif "sugar" in ingredient_lower:
            return ["honey", "maple syrup", "stevia", "agave nectar"]
        else:
            return ["Check with a cooking expert", "Research online", "Try similar ingredients"]
    
    def _get_basic_ingredients(self) -> Dict[str, Any]:
        """Get basic ingredient data"""
        return {
            "flour": {
                "name": "flour",
                "category": "grains",
                "description": "A powder made from ground grains, used as the base for many baked goods and sauces",
                "substitutes": ["almond flour", "coconut flour", "oat flour"],
                "storage_tips": ["Store in a cool, dry place", "Use within 6-12 months"],
                "cooking_tips": ["Measure accurately", "Sift before using", "Don't overmix"],
                "nutritional_info": {"calories": 364, "protein": 10, "carbs": 76, "fat": 1}
            },
            "eggs": {
                "name": "eggs",
                "category": "dairy_eggs",
                "description": "A versatile ingredient used for binding, leavening, and adding richness to dishes",
                "substitutes": ["flax eggs", "chia eggs", "banana"],
                "storage_tips": ["Store in refrigerator", "Use within 3-5 weeks"],
                "cooking_tips": ["Bring to room temperature", "Check for freshness", "Don't overcook"],
                "nutritional_info": {"calories": 155, "protein": 13, "carbs": 1, "fat": 11}
            },
            "butter": {
                "name": "butter",
                "category": "dairy_eggs",
                "description": "A dairy product made from churned cream, used for cooking, baking, and flavoring",
                "substitutes": ["olive oil", "coconut oil", "applesauce"],
                "storage_tips": ["Store in refrigerator", "Use within 1-3 months"],
                "cooking_tips": ["Use unsalted for baking", "Bring to room temperature", "Don't burn"],
                "nutritional_info": {"calories": 717, "protein": 1, "carbs": 0, "fat": 81}
            }
        }
    
    def _get_basic_techniques(self) -> Dict[str, Any]:
        """Get basic cooking technique data"""
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
    
    def _get_basic_cuisines(self) -> Dict[str, Any]:
        """Get basic cuisine data"""
        return {
            "italian": {
                "name": "italian",
                "description": "Traditional Italian cuisine known for pasta, pizza, and Mediterranean flavors",
                "key_ingredients": ["olive oil", "basil", "oregano", "parmesan", "tomatoes"],
                "signature_flavors": ["herbs", "garlic", "olive oil", "tomatoes"],
                "traditional_dishes": ["pasta", "pizza", "risotto", "osso buco"],
                "cooking_methods": ["sautéing", "braising", "roasting", "simmering"]
            },
            "french": {
                "name": "french",
                "description": "Classic French cuisine known for rich sauces and sophisticated techniques",
                "key_ingredients": ["butter", "wine", "shallots", "herbs de provence"],
                "signature_flavors": ["butter", "wine", "herbs", "shallots"],
                "traditional_dishes": ["coq au vin", "beef bourguignon", "ratatouille"],
                "cooking_methods": ["braising", "sautéing", "roasting", "poaching"]
            }
        }
    
    def _get_basic_equipment(self) -> Dict[str, Any]:
        """Get basic equipment data"""
        return {
            "chef_knife": {
                "name": "chef knife",
                "category": "knives",
                "description": "A versatile kitchen knife used for chopping, slicing, and dicing",
                "usage_instructions": [
                    "Hold the knife properly with a firm grip",
                    "Use a cutting board",
                    "Keep the blade sharp"
                ],
                "care_maintenance": [
                    "Hand wash only",
                    "Sharpen regularly",
                    "Store safely"
                ],
                "safety_tips": [
                    "Always cut away from yourself",
                    "Keep fingers clear of the blade",
                    "Use a stable cutting surface"
                ]
            }
        }
    
    def _get_basic_nutrition(self) -> Dict[str, Any]:
        """Get basic nutrition data"""
        return {
            "vegetables": {
                "category": "vegetables",
                "nutritional_profile": "Low in calories, high in vitamins and fiber",
                "health_benefits": ["Rich in antioxidants", "Good source of fiber", "Low in calories"],
                "cooking_methods": ["steaming", "roasting", "sautéing", "raw"],
                "portion_guidelines": "Fill half your plate with vegetables"
            }
        }
    
    def _get_basic_safety(self) -> Dict[str, Any]:
        """Get basic food safety data"""
        return {
            "meat": {
                "food_type": "meat",
                "safe_temperature": "145°F (63°C) for beef, pork, lamb; 165°F (74°C) for poultry",
                "storage_guidelines": "Store in refrigerator at 40°F or below",
                "shelf_life": "1-2 days in refrigerator, 3-4 months in freezer",
                "spoilage_signs": ["Unusual odor", "Discoloration", "Slimy texture"],
                "handling_tips": ["Keep separate from other foods", "Wash hands after handling", "Use separate cutting boards"]
            }
        }
    
    def _get_basic_substitutions(self) -> Dict[str, Any]:
        """Get basic substitution data"""
        return {
            "butter": ["olive oil", "coconut oil", "applesauce"],
            "eggs": ["flax eggs", "chia eggs", "banana"],
            "milk": ["almond milk", "soy milk", "oat milk"],
            "flour": ["almond flour", "coconut flour", "oat flour"],
            "sugar": ["honey", "maple syrup", "stevia"]
        }
    
    def get_knowledge_stats(self) -> Dict[str, Any]:
        """Get statistics about the knowledge base"""
        return {
            "total_ingredients": len(self.categories["ingredients"]),
            "total_techniques": len(self.categories["techniques"]),
            "total_cuisines": len(self.categories["cuisines"]),
            "total_equipment": len(self.categories["equipment"]),
            "total_nutrition_items": len(self.categories["nutrition"]),
            "total_safety_guidelines": len(self.categories["safety"]),
            "is_initialized": self.is_initialized
        }

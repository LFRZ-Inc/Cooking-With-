#!/usr/bin/env python3
"""
🍳 Cooking Models - AI Model Management for Cooking Ethos AI

This module handles loading and managing AI models specifically designed for
cooking, food recognition, recipe analysis, and culinary knowledge.
"""

import os
import json
import logging
import asyncio
from typing import Dict, List, Optional, Any, Tuple
import torch
from transformers import pipeline, AutoTokenizer, AutoModel, AutoProcessor

logger = logging.getLogger(__name__)

class CookingModels:
    """
    Manages AI models for cooking-specific tasks.
    
    This class handles:
    - Loading cooking-specialized models
    - Model inference for cooking tasks
    - Model optimization and caching
    - Resource management
    """
    
    def __init__(self):
        self.models = {}
        self.tokenizers = {}
        self.processors = {}
        self.is_initialized = False
        
        # Model configurations for cooking tasks
        self.model_configs = {
            "recipe_analysis": {
                "model_name": "microsoft/DialoGPT-medium",
                "task": "text-generation",
                "max_length": 512,
                "temperature": 0.7
            },
            "food_recognition": {
                "model_name": "microsoft/beit-base-patch16-224-pt22k-ft22k",
                "task": "image-classification",
                "top_k": 5
            },
            "ingredient_extraction": {
                "model_name": "microsoft/DialoGPT-small",
                "task": "text-generation",
                "max_length": 256,
                "temperature": 0.5
            },
            "cooking_conversation": {
                "model_name": "microsoft/DialoGPT-medium",
                "task": "text-generation",
                "max_length": 1024,
                "temperature": 0.8
            }
        }
        
        # Cooking-specific model paths (for fine-tuned models)
        self.cooking_model_paths = {
            "recipe_analyzer": "models/cooking/recipe_analyzer",
            "food_classifier": "models/cooking/food_classifier",
            "ingredient_extractor": "models/cooking/ingredient_extractor",
            "cooking_assistant": "models/cooking/cooking_assistant"
        }
    
    async def initialize(self):
        """Initialize cooking models"""
        logger.info("🤖 Initializing Cooking Models...")
        
        try:
            # Load base models
            await self._load_base_models()
            
            # Load cooking-specialized models if available
            await self._load_cooking_models()
            
            # Initialize model caches
            self._initialize_caches()
            
            self.is_initialized = True
            logger.info("✅ Cooking Models initialized successfully!")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Cooking Models: {str(e)}")
            raise
    
    async def cleanup(self):
        """Cleanup model resources"""
        logger.info("🧹 Cleaning up Cooking Models...")
        
        try:
            # Clear model caches
            for model_name in list(self.models.keys()):
                if hasattr(self.models[model_name], 'cpu'):
                    self.models[model_name].cpu()
                del self.models[model_name]
            
            # Clear tokenizers and processors
            self.tokenizers.clear()
            self.processors.clear()
            
            # Clear GPU memory
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
            
            self.is_initialized = False
            logger.info("✅ Cooking Models cleanup complete!")
            
        except Exception as e:
            logger.error(f"❌ Error during Cooking Models cleanup: {str(e)}")
    
    def is_ready(self) -> bool:
        """Check if models are ready"""
        return self.is_initialized and len(self.models) > 0
    
    async def _load_base_models(self):
        """Load base models for cooking tasks"""
        logger.info("📥 Loading base models...")
        
        for task_name, config in self.model_configs.items():
            try:
                logger.info(f"Loading {task_name} model: {config['model_name']}")
                
                if config["task"] == "text-generation":
                    # Load text generation model
                    model = pipeline(
                        task=config["task"],
                        model=config["model_name"],
                        device=0 if torch.cuda.is_available() else -1
                    )
                    self.models[task_name] = model
                    
                elif config["task"] == "image-classification":
                    # Load image classification model
                    model = pipeline(
                        task=config["task"],
                        model=config["model_name"],
                        device=0 if torch.cuda.is_available() else -1
                    )
                    self.models[task_name] = model
                
                logger.info(f"✅ Loaded {task_name} model")
                
            except Exception as e:
                logger.warning(f"⚠️ Failed to load {task_name} model: {str(e)}")
                # Continue with other models
    
    async def _load_cooking_models(self):
        """Load cooking-specialized models if available"""
        logger.info("🍳 Loading cooking-specialized models...")
        
        for model_name, model_path in self.cooking_model_paths.items():
            try:
                if os.path.exists(model_path):
                    logger.info(f"Loading cooking model: {model_name}")
                    
                    # Load model, tokenizer, and processor
                    model = AutoModel.from_pretrained(model_path)
                    tokenizer = AutoTokenizer.from_pretrained(model_path)
                    
                    # Move to GPU if available
                    if torch.cuda.is_available():
                        model = model.cuda()
                    
                    self.models[model_name] = model
                    self.tokenizers[model_name] = tokenizer
                    
                    logger.info(f"✅ Loaded cooking model: {model_name}")
                else:
                    logger.info(f"⚠️ Cooking model not found: {model_path}")
                    
            except Exception as e:
                logger.warning(f"⚠️ Failed to load cooking model {model_name}: {str(e)}")
    
    def _initialize_caches(self):
        """Initialize model caches for better performance"""
        logger.info("💾 Initializing model caches...")
        
        # Initialize conversation cache
        self.conversation_cache = {}
        
        # Initialize recipe analysis cache
        self.recipe_cache = {}
        
        # Initialize ingredient cache
        self.ingredient_cache = {}
        
        logger.info("✅ Model caches initialized")
    
    async def generate_cooking_response(self, prompt: str, context: Optional[Dict[str, Any]] = None) -> str:
        """
        Generate a cooking-focused response using the conversation model
        
        Args:
            prompt: User's cooking question or prompt
            context: Additional context for the response
        
        Returns:
            Generated cooking response
        """
        try:
            if "cooking_conversation" not in self.models:
                return self._fallback_cooking_response(prompt)
            
            # Prepare the prompt with cooking context
            cooking_prompt = self._prepare_cooking_prompt(prompt, context)
            
            # Generate response
            response = self.models["cooking_conversation"](
                cooking_prompt,
                max_length=self.model_configs["cooking_conversation"]["max_length"],
                temperature=self.model_configs["cooking_conversation"]["temperature"],
                do_sample=True,
                pad_token_id=self.tokenizers.get("cooking_conversation", None)
            )
            
            # Extract and clean the response
            generated_text = response[0]["generated_text"]
            cooking_response = self._extract_cooking_response(generated_text, prompt)
            
            return cooking_response
            
        except Exception as e:
            logger.error(f"❌ Error generating cooking response: {str(e)}")
            return self._fallback_cooking_response(prompt)
    
    async def analyze_recipe_text(self, recipe_text: str) -> Dict[str, Any]:
        """
        Analyze recipe text using the recipe analysis model
        
        Args:
            recipe_text: Recipe text to analyze
        
        Returns:
            Analysis results
        """
        try:
            if "recipe_analysis" not in self.models:
                return self._fallback_recipe_analysis(recipe_text)
            
            # Prepare recipe for analysis
            analysis_prompt = f"Analyze this recipe:\n\n{recipe_text}\n\nAnalysis:"
            
            # Generate analysis
            response = self.models["recipe_analysis"](
                analysis_prompt,
                max_length=self.model_configs["recipe_analysis"]["max_length"],
                temperature=self.model_configs["recipe_analysis"]["temperature"],
                do_sample=True
            )
            
            # Parse analysis results
            analysis_text = response[0]["generated_text"]
            analysis = self._parse_recipe_analysis(analysis_text)
            
            return analysis
            
        except Exception as e:
            logger.error(f"❌ Error analyzing recipe: {str(e)}")
            return self._fallback_recipe_analysis(recipe_text)
    
    async def extract_ingredients(self, text: str) -> List[Dict[str, Any]]:
        """
        Extract ingredients from text using the ingredient extraction model
        
        Args:
            text: Text containing ingredient information
        
        Returns:
            List of extracted ingredients
        """
        try:
            if "ingredient_extraction" not in self.models:
                return self._fallback_ingredient_extraction(text)
            
            # Prepare extraction prompt
            extraction_prompt = f"Extract ingredients from this text:\n\n{text}\n\nIngredients:"
            
            # Generate extraction
            response = self.models["ingredient_extraction"](
                extraction_prompt,
                max_length=self.model_configs["ingredient_extraction"]["max_length"],
                temperature=self.model_configs["ingredient_extraction"]["temperature"],
                do_sample=True
            )
            
            # Parse extracted ingredients
            extraction_text = response[0]["generated_text"]
            ingredients = self._parse_ingredient_extraction(extraction_text)
            
            return ingredients
            
        except Exception as e:
            logger.error(f"❌ Error extracting ingredients: {str(e)}")
            return self._fallback_ingredient_extraction(text)
    
    async def classify_food_image(self, image_path: str) -> List[Dict[str, Any]]:
        """
        Classify food in an image using the food recognition model
        
        Args:
            image_path: Path to the food image
        
        Returns:
            List of food classifications with confidence scores
        """
        try:
            if "food_recognition" not in self.models:
                return self._fallback_food_classification(image_path)
            
            # Load and preprocess image
            if not os.path.exists(image_path):
                raise FileNotFoundError(f"Image not found: {image_path}")
            
            # Classify food in image
            results = self.models["food_recognition"](
                image_path,
                top_k=self.model_configs["food_recognition"]["top_k"]
            )
            
            # Filter for food-related classifications
            food_results = self._filter_food_classifications(results)
            
            return food_results
            
        except Exception as e:
            logger.error(f"❌ Error classifying food image: {str(e)}")
            return self._fallback_food_classification(image_path)
    
    def _prepare_cooking_prompt(self, prompt: str, context: Optional[Dict[str, Any]] = None) -> str:
        """Prepare a cooking-focused prompt"""
        cooking_context = "You are a cooking expert assistant. Provide helpful, accurate advice about cooking, recipes, ingredients, and culinary techniques. "
        
        if context:
            if "cuisine_type" in context:
                cooking_context += f"Focus on {context['cuisine_type']} cuisine. "
            if "dietary_restrictions" in context:
                cooking_context += f"Consider dietary restrictions: {', '.join(context['dietary_restrictions'])}. "
            if "skill_level" in context:
                cooking_context += f"Provide advice suitable for {context['skill_level']} cooks. "
        
        return f"{cooking_context}\n\nUser: {prompt}\nAssistant:"
    
    def _extract_cooking_response(self, generated_text: str, original_prompt: str) -> str:
        """Extract the cooking response from generated text"""
        # Remove the original prompt from the response
        if original_prompt in generated_text:
            response = generated_text.split(original_prompt)[-1]
        else:
            response = generated_text
        
        # Clean up the response
        response = response.strip()
        response = response.replace("Assistant:", "").strip()
        
        return response
    
    def _parse_recipe_analysis(self, analysis_text: str) -> Dict[str, Any]:
        """Parse recipe analysis results"""
        analysis = {
            "difficulty": "intermediate",
            "cooking_time": "30 minutes",
            "cuisine_type": "general",
            "ingredients_count": 0,
            "steps_count": 0,
            "suggestions": [],
            "tips": []
        }
        
        # Simple parsing - in a real implementation, this would be more sophisticated
        if "easy" in analysis_text.lower():
            analysis["difficulty"] = "easy"
        elif "hard" in analysis_text.lower() or "difficult" in analysis_text.lower():
            analysis["difficulty"] = "hard"
        
        # Extract cooking time
        import re
        time_match = re.search(r'(\d+)\s*(?:minutes?|mins?|hours?|hrs?)', analysis_text.lower())
        if time_match:
            analysis["cooking_time"] = time_match.group(0)
        
        return analysis
    
    def _parse_ingredient_extraction(self, extraction_text: str) -> List[Dict[str, Any]]:
        """Parse ingredient extraction results"""
        ingredients = []
        
        # Simple parsing - in a real implementation, this would be more sophisticated
        lines = extraction_text.split('\n')
        for line in lines:
            line = line.strip()
            if line and not line.startswith('#'):
                # Try to parse ingredient line
                ingredient = self._parse_ingredient_line(line)
                if ingredient:
                    ingredients.append(ingredient)
        
        return ingredients
    
    def _parse_ingredient_line(self, line: str) -> Optional[Dict[str, Any]]:
        """Parse a single ingredient line"""
        import re
        
        # Try to match ingredient patterns
        patterns = [
            r'(\d+(?:\.\d+)?)\s*(\w+)\s+(.+)',  # "2 cups flour"
            r'(\d+(?:\.\d+)?)\s*(.+)',  # "2 large eggs"
            r'(.+)\s+to\s+taste',  # "salt to taste"
        ]
        
        for pattern in patterns:
            match = re.match(pattern, line, re.IGNORECASE)
            if match:
                if len(match.groups()) == 3:
                    amount, unit, name = match.groups()
                    return {
                        "amount": float(amount) if amount else None,
                        "unit": unit.lower(),
                        "name": name.strip(),
                        "original": line
                    }
                elif len(match.groups()) == 2:
                    amount, name = match.groups()
                    return {
                        "amount": float(amount) if amount else None,
                        "unit": None,
                        "name": name.strip(),
                        "original": line
                    }
        
        # If no pattern matches, treat as ingredient name only
        return {
            "amount": None,
            "unit": None,
            "name": line,
            "original": line
        }
    
    def _filter_food_classifications(self, results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Filter results to focus on food-related classifications"""
        food_keywords = [
            "food", "dish", "meal", "cuisine", "cooking", "recipe",
            "chicken", "beef", "pork", "fish", "vegetable", "fruit",
            "pasta", "rice", "bread", "cake", "soup", "salad"
        ]
        
        food_results = []
        for result in results:
            label = result.get("label", "").lower()
            if any(keyword in label for keyword in food_keywords):
                food_results.append(result)
        
        return food_results if food_results else results[:3]  # Return top 3 if no food-specific results
    
    def _fallback_cooking_response(self, prompt: str) -> str:
        """Fallback response when cooking model is not available"""
        return "I'm here to help with your cooking questions! I can assist with recipes, techniques, ingredients, and cooking tips. What would you like to know about cooking?"
    
    def _fallback_recipe_analysis(self, recipe_text: str) -> Dict[str, Any]:
        """Fallback recipe analysis when model is not available"""
        return {
            "difficulty": "intermediate",
            "cooking_time": "30 minutes",
            "cuisine_type": "general",
            "ingredients_count": len(recipe_text.split('\n')),
            "steps_count": len(recipe_text.split('\n')),
            "suggestions": ["Read through all instructions before starting", "Prep ingredients ahead of time"],
            "tips": ["Taste as you cook", "Adjust seasoning to your preference"]
        }
    
    def _fallback_ingredient_extraction(self, text: str) -> List[Dict[str, Any]]:
        """Fallback ingredient extraction when model is not available"""
        ingredients = []
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            if line and any(word in line.lower() for word in ["cup", "tbsp", "tsp", "oz", "lb", "g", "kg"]):
                ingredient = self._parse_ingredient_line(line)
                if ingredient:
                    ingredients.append(ingredient)
        
        return ingredients
    
    def _fallback_food_classification(self, image_path: str) -> List[Dict[str, Any]]:
        """Fallback food classification when model is not available"""
        return [
            {"label": "food", "score": 0.8},
            {"label": "dish", "score": 0.7},
            {"label": "meal", "score": 0.6}
        ]
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about loaded models"""
        return {
            "loaded_models": list(self.models.keys()),
            "model_configs": self.model_configs,
            "is_initialized": self.is_initialized,
            "gpu_available": torch.cuda.is_available(),
            "total_models": len(self.models)
        }

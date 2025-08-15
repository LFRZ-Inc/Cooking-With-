// Ethos-AI Railway Configuration
// Update this URL to match your Railway deployment

const ETHOS_AI_CONFIG = {
  // Your working Railway Ethos-AI deployment URL
  RAILWAY_URL: 'https://ethos-ai-production.up.railway.app',
  
  // Alternative URLs (update these if needed)
  FALLBACK_URL: 'http://localhost:8000',
  
  // API endpoints
  CHAT_ENDPOINT: '/api/chat',
  HEALTH_ENDPOINT: '/health',
  
  // Cooking-specific context
  COOKING_CONTEXT: {
    role: 'cooking_assistant',
    domain: 'culinary',
    expertise: ['recipes', 'ingredients', 'techniques', 'safety', 'tips']
  }
}

module.exports = ETHOS_AI_CONFIG

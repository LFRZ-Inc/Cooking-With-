# 🍳 Cooking Ethos AI - Railway Deployment

A specialized cooking AI assistant deployed on Railway for seamless integration with Cooking With! app.

## 🚀 Features

- **Cooking Specialist AI**: Focused on culinary knowledge and techniques
- **Ingredient Database**: Comprehensive information about common ingredients
- **Cooking Tips**: Organized tips by category and difficulty level
- **Smart Detection**: Automatically detects cooking-related queries
- **Source-Aware**: Different responses based on source (Cooking With! vs general use)

## 🔧 API Endpoints

### Health Check
```
GET /health
```

### Cooking Chat
```
POST /api/cooking/chat
```

### Ingredients
```
GET /api/cooking/ingredients
POST /api/cooking/ingredients
```

### Cooking Tips
```
GET /api/cooking/tips
POST /api/cooking/tips
```

### General Chat (with cooking detection)
```
POST /api/chat
```

## 🎯 Usage

### From Cooking With! App
The AI automatically detects when requests come from Cooking With! and provides specialized cooking responses.

### From General Use
When used from other sources, the AI detects cooking-related queries and redirects to cooking focus.

## 🛠 Deployment

This service is deployed on Railway and automatically scales based on demand.

## 📝 Environment Variables

- `PORT`: Railway automatically sets this
- No additional environment variables required

## 🔗 Integration

The Cooking With! app connects to this service via API calls, providing users with instant cooking assistance without any technical setup required.

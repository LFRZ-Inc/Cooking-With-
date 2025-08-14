# 🍳 Cooking Ethos AI - Specialized Food AI

A specialized version of Ethos AI focused exclusively on cooking, food, and culinary knowledge. This AI is designed to be your personal cooking assistant, providing expert advice on recipes, ingredients, techniques, and all things food-related.

## 🎯 **Purpose**

This is a **cooking-specialized fork** of the original Ethos AI, designed specifically for:
- **Food-related conversations only**
- **Cooking advice and tips**
- **Recipe analysis and suggestions**
- **Ingredient knowledge and substitutions**
- **Culinary technique guidance**
- **Integration with Cooking With! platform**

## 🏗️ **Architecture**

### **Core Components:**
- **Cooking-Specific Models**: Fine-tuned for culinary knowledge
- **Food Database**: Comprehensive ingredient and recipe knowledge
- **Cooking Chat Interface**: Specialized conversation system
- **Recipe Analysis Engine**: AI-powered recipe understanding
- **Culinary Knowledge Base**: Cooking techniques, tips, and best practices

### **Technology Stack:**
- **Backend**: FastAPI (Python)
- **AI/ML**: Transformers, PyTorch, NumPy
- **Database**: SQLite for knowledge storage
- **Frontend**: HTML/CSS/JavaScript (Simple chat interface)
- **API**: RESTful endpoints for cooking interactions

## 🚀 **Features**

### **Core AI Capabilities:**
- **Cooking Chat**: Natural language conversations about food and cooking
- **Recipe Analysis**: Parse and analyze recipe text for ingredients, instructions, and tips
- **Food Recognition**: Identify food items in images (placeholder implementation)
- **Ingredient Information**: Detailed knowledge about ingredients, substitutions, and uses
- **Cooking Techniques**: Comprehensive guide to cooking methods and techniques
- **Food Safety**: Safety guidelines and best practices
- **Recipe Suggestions**: Personalized recipe recommendations

### **API Endpoints:**
- `POST /api/cooking/chat` - Cooking conversation interface
- `POST /api/cooking/analyze-recipe` - Recipe text analysis
- `POST /api/cooking/recognize-food` - Food image recognition
- `GET /api/cooking/ingredient/{name}` - Ingredient information
- `GET /api/cooking/techniques` - Cooking techniques database
- `GET /api/cooking/suggestions` - Recipe suggestions
- `GET /api/cooking/tips` - Cooking tips and advice

## 📁 **Project Structure**

```
Cooking-Ethos-AI/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   ├── cooking_ai.py          # Core AI processing
│   ├── cooking_chat.py        # Chat interface
│   ├── cooking_models.py      # AI model management
│   ├── cooking_prompts.py     # Cooking-specific prompts
│   ├── cooking_knowledge.py   # Knowledge base
│   ├── recipe_analyzer.py     # Recipe analysis
│   └── food_recognition.py    # Food recognition
├── frontend/
│   └── index.html             # Chat interface
└── README.md                  # This file
```

## 🛠️ **Setup Instructions**

### **Prerequisites:**
- Python 3.8+
- pip (Python package manager)
- Modern web browser

### **Backend Setup:**
1. Navigate to the backend directory:
   ```bash
   cd Cooking-Ethos-AI/backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the FastAPI server:
   ```bash
   python main.py
   ```

4. The server will start on `http://localhost:8000`

### **Frontend Setup:**
1. Navigate to the frontend directory:
   ```bash
   cd Cooking-Ethos-AI/frontend
   ```

2. Open `index.html` in your web browser
   - Or serve it using a local server:
   ```bash
   python -m http.server 8080
   ```

3. Access the chat interface at `http://localhost:8080`

## 🔗 **Access Points**

### **API Documentation:**
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **Health Check**: `http://localhost:8000/health`

### **Chat Interface:**
- **Web Chat**: Open `frontend/index.html` in your browser
- **Direct API**: Use the `/api/cooking/chat` endpoint

## 🔄 **Integration with Cooking With!**

This Cooking Ethos AI can be integrated with the main Cooking With! platform:

### **Integration Points:**
- **Recipe Analysis**: Analyze imported recipes
- **Cooking Chat**: Provide cooking assistance within the app
- **Food Recognition**: Identify ingredients from uploaded images
- **Ingredient Database**: Access comprehensive ingredient knowledge

### **API Integration:**
```javascript
// Example integration with Cooking With!
const response = await fetch('http://localhost:8000/api/cooking/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        message: "How do I cook chicken breast?",
        context: { user_id: "123", recipe_id: "456" },
        user_preferences: { dietary_restrictions: ["vegetarian"] }
    })
});
```

## 👥 **User Experience**

### **Chat Interface Features:**
- **Real-time Responses**: Instant cooking advice and suggestions
- **Quick Suggestions**: Pre-defined cooking questions for easy access
- **Contextual Responses**: Tailored advice based on conversation history
- **Visual Feedback**: Typing indicators and smooth animations
- **Mobile Responsive**: Works on all device sizes

### **Conversation Examples:**
- "How do I cook chicken breast?"
- "What can I substitute for butter?"
- "How do I make pasta?"
- "What's the safe temperature for cooking meat?"
- "Can you analyze this recipe for me?"

## 🔒 **Privacy & Security**

- **Local Processing**: All AI processing happens locally
- **No External APIs**: No dependency on third-party AI services
- **Data Privacy**: User conversations are not stored or shared
- **Secure Communication**: HTTPS-ready for production deployment

## 🚀 **Deployment**

### **Development:**
- Backend: `python main.py`
- Frontend: Open HTML file directly or use local server

### **Production:**
- **Backend**: Deploy FastAPI app to cloud platform (Heroku, Railway, etc.)
- **Frontend**: Deploy static files to CDN or web server
- **Database**: Use production SQLite or migrate to PostgreSQL
- **Environment**: Set up proper CORS and security headers

## 🔮 **Future Enhancements**

### **Planned Features:**
- **Advanced Food Recognition**: Real computer vision for food identification
- **Recipe Generation**: AI-powered recipe creation
- **Meal Planning**: Intelligent meal planning and suggestions
- **Nutritional Analysis**: Detailed nutritional information
- **Multi-language Support**: Cooking assistance in multiple languages
- **Voice Interface**: Voice-activated cooking assistant
- **Image Upload**: Direct image upload for food recognition
- **Recipe Import**: Import recipes from various sources

### **AI Model Improvements:**
- **Fine-tuned Models**: Cooking-specific language models
- **Computer Vision**: Advanced food recognition models
- **Knowledge Expansion**: Larger culinary knowledge base
- **Personalization**: User preference learning

## 🤝 **Contributing**

This is a specialized fork focused on cooking. Contributions should be:
- **Cooking-focused**: All features should relate to food and cooking
- **Well-documented**: Clear documentation for all changes
- **Tested**: Proper testing for all new features
- **User-friendly**: Intuitive and helpful user experience

## 📄 **License**

This project is a specialized fork of Ethos AI, focused exclusively on cooking and culinary knowledge.

## 🆘 **Support**

For issues and questions:
1. Check the API documentation at `/docs`
2. Review the health check endpoint
3. Ensure all dependencies are installed
4. Verify the backend server is running

---

**🍳 Happy Cooking with Cooking Ethos AI!**

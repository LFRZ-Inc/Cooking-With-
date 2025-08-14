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

### **Integration:**
- **Cooking With! Platform**: Seamless integration with main cooking app
- **Chat Widget**: Embedded chat interface for food questions
- **Recipe Enhancement**: AI-powered recipe improvement suggestions
- **Food Recognition**: Enhanced food identification and analysis

## 🚀 **Features**

### **🍽️ Cooking Expertise**
- **Recipe Analysis**: Understand and improve any recipe
- **Ingredient Knowledge**: Comprehensive ingredient database
- **Technique Guidance**: Step-by-step cooking instructions
- **Substitution Advice**: Smart ingredient substitutions
- **Nutritional Information**: Detailed nutritional analysis
- **Cuisine Knowledge**: Global culinary traditions and techniques

### **💬 Specialized Chat**
- **Food-Only Conversations**: Focused on culinary topics
- **Context-Aware Responses**: Understands cooking context
- **Recipe Suggestions**: Personalized recipe recommendations
- **Cooking Tips**: Expert advice and best practices
- **Problem Solving**: Troubleshoot cooking issues
- **Learning Mode**: Educational cooking guidance

### **🔗 Platform Integration**
- **Cooking With! Integration**: Seamless connection with main app
- **Recipe Enhancement**: AI-powered recipe improvements
- **Smart Recommendations**: Personalized cooking suggestions
- **Food Recognition**: Enhanced image analysis
- **User Preferences**: Personalized advice

## 📊 **Training Data**

### **Culinary Datasets:**
- **Recipe Collections**: Millions of recipes from various cuisines
- **Ingredient Database**: Comprehensive ingredient knowledge
- **Cooking Techniques**: Traditional and modern cooking methods
- **Nutritional Data**: Detailed nutritional information
- **Culinary Literature**: Cookbooks, food blogs, and culinary guides
- **User Interactions**: Cooking-related conversations and queries

### **Specialized Knowledge:**
- **Global Cuisines**: International cooking traditions
- **Dietary Restrictions**: Vegan, vegetarian, gluten-free, etc.
- **Cooking Equipment**: Knowledge of various cooking tools
- **Food Safety**: Important food safety guidelines
- **Seasonal Cooking**: Seasonal ingredients and techniques
- **Wine Pairing**: Food and wine pairing knowledge

## 🛠️ **Technical Stack**

### **Backend:**
- **Python 3.11+**: Core AI processing
- **FastAPI**: High-performance API framework
- **Ollama**: Local AI model management
- **PostgreSQL**: Cooking knowledge database
- **Redis**: Caching and session management

### **Frontend:**
- **React**: Modern web interface
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Responsive design
- **WebSocket**: Real-time chat communication

### **AI Models:**
- **Cooking-Specialized LLM**: Fine-tuned for culinary knowledge
- **Food Recognition Model**: Enhanced image analysis
- **Recipe Understanding Model**: Deep recipe comprehension
- **Conversation Model**: Natural cooking conversations

## 🔧 **Setup Instructions**

### **1. Clone the Repository**
```bash
git clone https://github.com/LFRZ-Inc/Cooking-Ethos-AI.git
cd Cooking-Ethos-AI
```

### **2. Install Dependencies**
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

### **3. Configure Environment**
```bash
# Copy environment template
cp .env.example .env

# Edit with your settings
nano .env
```

### **4. Initialize Database**
```bash
# Run database migrations
python backend/migrations/init_db.py

# Load cooking knowledge base
python backend/scripts/load_cooking_data.py
```

### **5. Start Services**
```bash
# Terminal 1: Backend
cd backend
python main.py

# Terminal 2: Frontend
cd frontend
npm run dev
```

## 🌐 **Access Points**

- **Web Interface**: http://localhost:1420
- **API Endpoints**: http://localhost:8000
- **Cooking With! Integration**: Via API calls
- **Chat Widget**: Embedded in Cooking With! platform

## 🔗 **Integration with Cooking With!**

### **API Endpoints:**
- `POST /api/cooking/chat` - Cooking conversation
- `POST /api/cooking/analyze-recipe` - Recipe analysis
- `POST /api/cooking/suggestions` - Recipe suggestions
- `POST /api/cooking/ingredients` - Ingredient information
- `POST /api/cooking/techniques` - Cooking technique guidance

### **Chat Widget:**
```typescript
// Embed in Cooking With! platform
<CookingEthosChat
  onMessage={(message) => {
    // Handle cooking conversation
  }}
  onRecipeSuggestion={(recipe) => {
    // Handle recipe suggestions
  }}
/>
```

## 🎨 **User Experience**

### **Chat Interface:**
- **Food-Focused**: Only cooking-related conversations
- **Context-Aware**: Understands cooking context
- **Helpful Responses**: Expert culinary advice
- **Recipe Integration**: Direct recipe suggestions
- **Learning Mode**: Educational cooking guidance

### **Cooking With! Integration:**
- **Seamless Experience**: Integrated into main platform
- **Recipe Enhancement**: AI-powered improvements
- **Smart Recommendations**: Personalized suggestions
- **Food Recognition**: Enhanced image analysis
- **User Preferences**: Personalized advice

## 🔒 **Privacy & Security**

- **Local Processing**: All AI processing happens locally
- **No External APIs**: No dependency on paid services
- **User Data Protection**: Complete data privacy
- **Offline Capability**: Works without internet connection
- **Secure Communication**: Encrypted API communication

## 🚀 **Deployment**

### **Local Development:**
```bash
# Development mode
npm run dev
python backend/main.py --dev
```

### **Production Deployment:**
```bash
# Build for production
npm run build
python backend/main.py --production
```

### **Docker Deployment:**
```bash
# Build and run with Docker
docker-compose up --build
```

## 📈 **Future Enhancements**

### **Planned Features:**
- **Voice Integration**: Voice-based cooking conversations
- **Video Analysis**: Cooking technique video analysis
- **Recipe Generation**: AI-powered recipe creation
- **Meal Planning**: Intelligent meal planning assistance
- **Shopping Lists**: Smart shopping list generation
- **Nutritional Tracking**: Advanced nutritional analysis

### **Advanced Capabilities:**
- **Multi-Modal Learning**: Text, image, and video understanding
- **Personalized Cooking**: User-specific cooking preferences
- **Cultural Cooking**: Deep cultural culinary knowledge
- **Seasonal Intelligence**: Seasonal ingredient awareness
- **Dietary Expertise**: Specialized dietary knowledge

## 🤝 **Contributing**

This is a specialized fork focused on cooking. Contributions should be:
- **Cooking-focused**: Related to culinary knowledge
- **Quality-focused**: High-quality cooking information
- **User-focused**: Improving cooking experience
- **Privacy-focused**: Maintaining local processing

## 📄 **License**

This project is licensed under the same terms as the original Ethos AI, with additional cooking-specific modifications.

---

**🍳 Cooking Ethos AI - Your Personal Cooking Assistant**

*Powered by local AI, focused on food, designed for cooking enthusiasts.* 
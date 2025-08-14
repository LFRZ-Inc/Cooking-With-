# Ethos AI Food Recognition Integration

This folder contains the Ethos AI integration for the Cooking With! platform, providing cost-free food recognition capabilities using local AI models.

## 🎯 Overview

The Ethos AI integration replaces OpenAI's GPT-4 Vision with a local LLaVA (Large Language and Vision Assistant) model, allowing users to:

- Take photos of cooked dishes
- Automatically generate recipes
- Avoid OpenAI API costs
- Maintain complete privacy and data control

## 🚀 Quick Start

### 1. Install Ethos AI

```bash
# Clone the Ethos AI repository
git clone https://github.com/LFRZ-Inc/Ethos-AI.git

# Navigate to the Ethos AI directory
cd Ethos-AI

# Install Python dependencies
pip install -r requirements.txt

# Install Ollama (if not already installed)
# Visit: https://ollama.ai/download
```

### 2. Download Required Models

```bash
# Pull the LLaVA model for vision analysis
ollama pull llava:7b

# Pull Llama model for text generation
ollama pull llama3.2:3b
```

### 3. Start Ethos AI Server

```bash
# Start the Ethos AI backend server
python backend/main.py

# The server will be available at http://localhost:8000
```

### 4. Configure Cooking With!

Add the following to your `.env.local` file:

```env
# Ethos AI Configuration
ETHOS_AI_URL=http://localhost:8000
```

### 5. Test the Integration

1. Start your Cooking With! application
2. Navigate to the recipe import page
3. Select "AI Food Recognition"
4. Upload a photo of cooked food
5. Verify that a recipe is generated

## 📁 Integration Files

### Core Service
- `lib/ethosFoodRecognitionService.ts` - Main service for Ethos AI integration

### API Endpoints
- `app/api/recipes/ethos-food-recognition/route.ts` - API endpoint for food recognition

### Frontend Components
- `components/RecipeImportWizard.tsx` - Updated to use Ethos AI

### Configuration
- `setup-env.js` - Environment setup helper
- `test-ethos-food-recognition.js` - Test and documentation script

## 🔧 How It Works

### 1. Image Analysis
The system uses LLaVA (llava:7b) to analyze food images:

```typescript
const analysis = await this.analyzeImageWithEthosAI(imageUrl)
```

### 2. Recipe Generation
Llama (llama3.2:3b) generates recipes based on the analysis:

```typescript
const recipe = await this.generateRecipeFromAnalysis(analysis, userPreferences)
```

### 3. Data Processing
The generated recipe is parsed and structured for the application:

```typescript
const structuredRecipe = this.parseGeneratedRecipe(recipe, analysis)
```

## 🎛️ Configuration Options

### Model Selection
You can modify the models used in `lib/ethosFoodRecognitionService.ts`:

```typescript
// Vision model for image analysis
const response = await this.callEthosAI(prompt, 'llava-7b')

// Text model for recipe generation
const response = await this.callEthosAI(prompt, 'llama3.2-3b')
```

### Prompt Customization
Customize the prompts for better results:

```typescript
const prompt = `Analyze this food image and provide a detailed description.
    
Please provide:
1. A detailed description of what you see
2. List of ingredients that are likely used
3. The cooking method (baking, frying, grilling, etc.)
4. Estimated difficulty level (Easy/Medium/Hard)
    
Respond in JSON format:
{
  "description": "detailed description",
  "ingredients": ["ingredient1", "ingredient2"],
  "cookingMethod": "method",
  "difficulty": "Easy/Medium/Hard"
}
    
Image URL: ${imageUrl}`
```

### Confidence Thresholds
Adjust confidence thresholds for validation:

```typescript
if (validationResult.confidence < 0.5) {
  // Handle low confidence cases
}
```

## 📊 Performance Optimization

### GPU Acceleration
For better performance, ensure GPU support:

```bash
# Check if CUDA is available
nvidia-smi

# Install CUDA-enabled PyTorch if needed
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

### Model Optimization
Consider using quantized models for faster inference:

```bash
# Pull quantized versions
ollama pull llava:7b-q4_0
ollama pull llama3.2:3b-q4_0
```

### Memory Management
Monitor memory usage and adjust model loading:

```typescript
// In ethosFoodRecognitionService.ts
private async callEthosAI(prompt: string, model: string = 'llama3.2-3b') {
  // Add timeout and error handling
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout
  
  try {
    const response = await fetch(`${this.ethosApiUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: prompt,
        model_override: model,
        use_tools: false
      }),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    // ... rest of the code
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}
```

## 🔍 Troubleshooting

### Common Issues

1. **Ethos AI server not responding**
   ```bash
   # Check if server is running
   curl http://localhost:8000/health
   
   # Check logs
   tail -f Ethos-AI/backend/logs/app.log
   ```

2. **Model not found**
   ```bash
   # List available models
   ollama list
   
   # Pull missing models
   ollama pull llava:7b
   ollama pull llama3.2:3b
   ```

3. **Low accuracy results**
   - Ensure good image quality
   - Adjust prompts for better specificity
   - Consider using larger models

4. **Slow response times**
   - Use quantized models
   - Enable GPU acceleration
   - Optimize image preprocessing

### Debug Mode
Enable debug logging in the service:

```typescript
// Add to ethosFoodRecognitionService.ts
private debug = process.env.NODE_ENV === 'development'

private async callEthosAI(prompt: string, model: string = 'llama3.2-3b') {
  if (this.debug) {
    console.log(`Calling Ethos AI with model: ${model}`)
    console.log(`Prompt: ${prompt.substring(0, 200)}...`)
  }
  
  // ... rest of the code
  
  if (this.debug) {
    console.log(`Response: ${data.content.substring(0, 200)}...`)
  }
}
```

## 🔄 Updates and Maintenance

### Updating Ethos AI
```bash
cd Ethos-AI
git pull origin main
pip install -r requirements.txt
```

### Updating Models
```bash
# Update LLaVA model
ollama pull llava:7b

# Update Llama model
ollama pull llama3.2:3b
```

### Monitoring
Set up monitoring for the Ethos AI service:

```bash
# Check service status
systemctl status ethos-ai

# Monitor resource usage
htop
nvidia-smi  # if using GPU
```

## 📈 Advanced Customization

### Custom Model Integration
Add support for additional models:

```typescript
// In ethosFoodRecognitionService.ts
private async callEthosAI(prompt: string, model: string = 'llama3.2-3b') {
  // Add model-specific configurations
  const modelConfigs = {
    'llava-7b': { maxTokens: 2048, temperature: 0.7 },
    'llama3.2-3b': { maxTokens: 4096, temperature: 0.7 },
    'custom-model': { maxTokens: 2048, temperature: 0.5 }
  }
  
  const config = modelConfigs[model] || modelConfigs['llama3.2-3b']
  
  // ... rest of the code
}
```

### Image Preprocessing
Add image preprocessing for better results:

```typescript
private async preprocessImage(imageUrl: string): Promise<string> {
  // Add image enhancement, cropping, etc.
  // This could use sharp or other image processing libraries
  return imageUrl
}
```

### Multi-Model Ensemble
Use multiple models for better accuracy:

```typescript
private async ensembleAnalysis(imageUrl: string) {
  const models = ['llava-7b', 'llava-13b', 'custom-vision-model']
  const results = await Promise.all(
    models.map(model => this.analyzeImageWithEthosAI(imageUrl, model))
  )
  
  // Combine results for better accuracy
  return this.combineResults(results)
}
```

## 📚 Additional Resources

- [Ethos AI Documentation](https://github.com/LFRZ-Inc/Ethos-AI)
- [LLaVA Model Information](https://github.com/haotian-liu/LLaVA)
- [Ollama Documentation](https://ollama.ai/docs)
- [Cooking With! Main Documentation](../README.md)

## 🤝 Contributing

To contribute to the Ethos AI integration:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This integration is part of the Cooking With! platform and follows the same license terms.

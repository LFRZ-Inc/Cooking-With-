# Ethos AI Deployment Guide for Vercel

## Overview

This guide explains how to deploy Ethos AI to work seamlessly with your Cooking With! app on Vercel.

## Deployment Options

### Option 1: Railway Deployment (Recommended)

Railway is perfect for deploying Python applications with GPU support.

#### Step 1: Prepare Ethos AI for Deployment

```bash
# Clone Ethos AI to a separate repository
git clone https://github.com/LFRZ-Inc/Ethos-AI.git
cd Ethos-AI

# Create a requirements.txt file
pip freeze > requirements.txt

# Create a Procfile for Railway
echo "web: python backend/main.py" > Procfile

# Create a runtime.txt file
echo "python-3.11" > runtime.txt
```

#### Step 2: Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub account
3. Create a new project from your Ethos AI repository
4. Add environment variables:
   ```
   PORT=8000
   OLLAMA_HOST=0.0.0.0
   ```
5. Deploy the project

#### Step 3: Configure Your Vercel App

Update your `.env.local` file:
```env
# Ethos AI Configuration
ETHOS_AI_URL=https://your-railway-app.railway.app
```

### Option 2: Render Deployment

Render provides free GPU instances for AI applications.

#### Step 1: Prepare for Render

Create a `render.yaml` file in your Ethos AI repository:

```yaml
services:
  - type: web
    name: ethos-ai
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: python backend/main.py
    envVars:
      - key: PORT
        value: 8000
      - key: OLLAMA_HOST
        value: 0.0.0.0
```

#### Step 2: Deploy to Render

1. Go to [Render.com](https://render.com)
2. Connect your GitHub account
3. Create a new Web Service
4. Select your Ethos AI repository
5. Configure the build settings
6. Deploy

### Option 3: DigitalOcean App Platform

For more control and better performance.

#### Step 1: Create Dockerfile

Create a `Dockerfile` in your Ethos AI repository:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Ollama
RUN curl -fsSL https://ollama.ai/install.sh | sh

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Start the application
CMD ["python", "backend/main.py"]
```

#### Step 2: Deploy to DigitalOcean

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Create a new app
3. Connect your GitHub repository
4. Configure the build settings
5. Deploy

## Configuration for Your Vercel App

### Environment Variables

Add these to your Vercel project settings:

```env
# Production Ethos AI URL
ETHOS_AI_URL=https://your-deployed-ethos-ai.com

# Fallback to OpenAI (optional)
OPENAI_API_KEY=your-openai-key
```

### Update Your Service

Modify `lib/ethosFoodRecognitionService.ts` to handle deployment:

```typescript
export class EthosFoodRecognitionService {
  private ethosApiUrl: string
  private fallbackToOpenAI: boolean

  constructor() {
    this.ethosApiUrl = process.env.ETHOS_AI_URL || 'http://localhost:8000'
    this.fallbackToOpenAI = process.env.OPENAI_API_KEY ? true : false
  }

  async analyzeFoodImage(request: RecipeGenerationRequest): Promise<EthosFoodRecognitionResult> {
    try {
      // Try Ethos AI first
      return await this.analyzeWithEthosAI(request)
    } catch (error) {
      console.error('Ethos AI failed:', error)
      
      // Fallback to OpenAI if configured
      if (this.fallbackToOpenAI) {
        console.log('Falling back to OpenAI...')
        return await this.analyzeWithOpenAI(request)
      }
      
      throw error
    }
  }

  private async analyzeWithEthosAI(request: RecipeGenerationRequest): Promise<EthosFoodRecognitionResult> {
    // Your existing Ethos AI logic
  }

  private async analyzeWithOpenAI(request: RecipeGenerationRequest): Promise<EthosFoodRecognitionResult> {
    // OpenAI fallback logic
  }
}
```

## Cost Analysis

### Railway Deployment
- **Free tier**: 500 hours/month
- **Paid tier**: $5/month for 1000 hours
- **GPU tier**: $20/month for GPU instances

### Render Deployment
- **Free tier**: 750 hours/month
- **Paid tier**: $7/month for unlimited hours
- **GPU tier**: $25/month for GPU instances

### DigitalOcean App Platform
- **Basic**: $5/month
- **Pro**: $12/month
- **GPU**: $40/month

## Performance Optimization

### Model Optimization

Use quantized models for faster inference:

```bash
# Pull quantized models
ollama pull llava:7b-q4_0
ollama pull llama3.2:3b-q4_0
```

### Caching

Implement caching to avoid re-analyzing similar images:

```typescript
private async getCachedResult(imageHash: string): Promise<EthosFoodRecognitionResult | null> {
  const { data } = await this.supabase
    .from('ai_analysis_cache')
    .select('*')
    .eq('image_hash', imageHash)
    .single()
  
  return data ? JSON.parse(data.result) : null
}
```

### Load Balancing

For high traffic, deploy multiple Ethos AI instances:

```typescript
private getEthosApiUrl(): string {
  const urls = [
    process.env.ETHOS_AI_URL_1,
    process.env.ETHOS_AI_URL_2,
    process.env.ETHOS_AI_URL_3
  ].filter(Boolean)
  
  return urls[Math.floor(Math.random() * urls.length)] || this.ethosApiUrl
}
```

## Monitoring and Maintenance

### Health Checks

Add health check endpoints to your Ethos AI deployment:

```python
@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'models_loaded': get_loaded_models(),
        'uptime': get_uptime()
    })
```

### Logging

Implement comprehensive logging:

```typescript
private async callEthosAI(prompt: string, model: string = 'llama3.2-3b') {
  const startTime = Date.now()
  
  try {
    const response = await fetch(`${this.ethosApiUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: prompt,
        model_override: model,
        use_tools: false
      })
    })

    const duration = Date.now() - startTime
    console.log(`Ethos AI call completed in ${duration}ms`)
    
    return response.json()
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`Ethos AI call failed after ${duration}ms:`, error)
    throw error
  }
}
```

## Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Increase timeout values
   - Check network connectivity
   - Verify deployment URL

2. **Model Loading Errors**
   - Ensure models are downloaded
   - Check available memory
   - Use smaller models if needed

3. **Performance Issues**
   - Use quantized models
   - Implement caching
   - Scale horizontally

### Debug Mode

Enable debug logging in production:

```typescript
const DEBUG_MODE = process.env.NODE_ENV === 'development' || process.env.DEBUG_ETHOS === 'true'

if (DEBUG_MODE) {
  console.log('Ethos AI Debug Mode Enabled')
  console.log('API URL:', this.ethosApiUrl)
  console.log('Request:', { prompt: prompt.substring(0, 100) + '...' })
}
```

## Security Considerations

### API Security

Implement authentication for your Ethos AI deployment:

```typescript
private async callEthosAI(prompt: string, model: string = 'llama3.2-3b') {
  const response = await fetch(`${this.ethosApiUrl}/chat`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ETHOS_AI_API_KEY}`
    },
    body: JSON.stringify({
      content: prompt,
      model_override: model,
      use_tools: false
    })
  })
}
```

### Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
private rateLimiter = new Map<string, number[]>()

private async checkRateLimit(userId: string): Promise<boolean> {
  const now = Date.now()
  const userRequests = this.rateLimiter.get(userId) || []
  
  // Remove requests older than 1 hour
  const recentRequests = userRequests.filter(time => now - time < 3600000)
  
  if (recentRequests.length >= 10) { // 10 requests per hour
    return false
  }
  
  recentRequests.push(now)
  this.rateLimiter.set(userId, recentRequests)
  return true
}
```

## Conclusion

The recommended approach is to deploy Ethos AI to Railway or Render, which will:

1. ✅ Work seamlessly with your Vercel deployment
2. ✅ Provide reliable, scalable AI processing
3. ✅ Keep costs low (~$5-25/month)
4. ✅ Maintain privacy and control
5. ✅ Allow for easy scaling and monitoring

This setup gives you the best of both worlds: the cost-effectiveness and privacy of local AI models with the convenience and reliability of cloud deployment.

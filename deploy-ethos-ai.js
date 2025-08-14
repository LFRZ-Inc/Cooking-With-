#!/usr/bin/env node

/**
 * Ethos AI Deployment Script
 * 
 * This script helps you deploy Ethos AI to Railway for use with your Cooking With! app.
 * 
 * Usage:
 * node deploy-ethos-ai.js
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Ethos AI Deployment Script')
console.log('=============================\n')

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: Please run this script from your Cooking With! project root')
  process.exit(1)
}

// Create deployment directory
const deployDir = path.join(__dirname, 'ethos-ai-deployment')
if (!fs.existsSync(deployDir)) {
  fs.mkdirSync(deployDir)
  console.log('✅ Created deployment directory')
}

// Create necessary files for Railway deployment
console.log('\n📝 Creating deployment files...')

// Create requirements.txt
const requirementsContent = `flask==2.3.3
requests==2.31.0
python-dotenv==1.0.0
ollama==0.1.7
`
fs.writeFileSync(path.join(deployDir, 'requirements.txt'), requirementsContent)

// Create Procfile
const procfileContent = `web: python app.py
`
fs.writeFileSync(path.join(deployDir, 'Procfile'), procfileContent)

// Create runtime.txt
const runtimeContent = `python-3.11
`
fs.writeFileSync(path.join(deployDir, 'runtime.txt'), runtimeContent)

// Create main application file
const appContent = `import os
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configuration
OLLAMA_HOST = os.environ.get('OLLAMA_HOST', 'localhost')
OLLAMA_PORT = os.environ.get('OLLAMA_PORT', '11434')
ETHOS_API_URL = f"http://{OLLAMA_HOST}:{OLLAMA_PORT}"

@app.route('/health')
def health_check():
    """Health check endpoint"""
    try:
        # Check if Ollama is running
        response = requests.get(f"{ETHOS_API_URL}/api/tags", timeout=5)
        if response.status_code == 200:
            return jsonify({
                'status': 'healthy',
                'ollama_connected': True,
                'models': response.json().get('models', [])
            })
        else:
            return jsonify({
                'status': 'unhealthy',
                'ollama_connected': False,
                'error': 'Ollama not responding'
            }), 503
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'ollama_connected': False,
            'error': str(e)
        }), 503

@app.route('/chat', methods=['POST'])
def chat():
    """Main chat endpoint for Ethos AI"""
    try:
        data = request.get_json()
        content = data.get('content', '')
        model_override = data.get('model_override', 'llama3.2-3b')
        use_tools = data.get('use_tools', False)
        
        if not content:
            return jsonify({'error': 'Content is required'}), 400
        
        # Prepare request for Ollama
        ollama_request = {
            'model': model_override,
            'prompt': content,
            'stream': False
        }
        
        # Make request to Ollama
        response = requests.post(
            f"{ETHOS_API_URL}/api/generate",
            json=ollama_request,
            timeout=120  # 2 minute timeout
        )
        
        if response.status_code != 200:
            return jsonify({
                'error': f'Ollama API error: {response.status_code}',
                'details': response.text
            }), 500
        
        ollama_response = response.json()
        
        return jsonify({
            'content': ollama_response.get('response', ''),
            'model_used': model_override,
            'usage': {
                'prompt_tokens': ollama_response.get('prompt_eval_count', 0),
                'completion_tokens': ollama_response.get('eval_count', 0),
                'total_tokens': ollama_response.get('prompt_eval_count', 0) + ollama_response.get('eval_count', 0)
            }
        })
        
    except requests.exceptions.Timeout:
        return jsonify({'error': 'Request timeout'}), 408
    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/models', methods=['GET'])
def list_models():
    """List available models"""
    try:
        response = requests.get(f"{ETHOS_API_URL}/api/tags", timeout=10)
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'error': 'Failed to fetch models'}), 500
    except Exception as e:
        return jsonify({'error': f'Error fetching models: {str(e)}'}), 500

@app.route('/pull', methods=['POST'])
def pull_model():
    """Pull a model from Ollama"""
    try:
        data = request.get_json()
        model_name = data.get('model')
        
        if not model_name:
            return jsonify({'error': 'Model name is required'}), 400
        
        # Start model pull
        response = requests.post(
            f"{ETHOS_API_URL}/api/pull",
            json={'name': model_name},
            timeout=300  # 5 minute timeout for model download
        )
        
        if response.status_code == 200:
            return jsonify({'message': f'Model {model_name} pulled successfully'})
        else:
            return jsonify({'error': f'Failed to pull model: {response.text}'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Error pulling model: {str(e)}'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)
`
fs.writeFileSync(path.join(deployDir, 'app.py'), appContent)

// Create README for deployment
const readmeContent = `# Ethos AI Railway Deployment

This is a simplified version of Ethos AI designed to run on Railway.

## Setup Instructions

1. **Deploy to Railway:**
   - Go to [Railway.app](https://railway.app)
   - Create a new project
   - Connect this repository
   - Add environment variables:
     - \`OLLAMA_HOST\`: \`0.0.0.0\`
     - \`OLLAMA_PORT\`: \`11434\`

2. **Install Ollama:**
   - Railway will automatically install Ollama during deployment
   - The app will handle model management

3. **Pull Required Models:**
   After deployment, pull the required models:
   \`\`\`bash
   curl -X POST https://your-app.railway.app/pull \\
     -H "Content-Type: application/json" \\
     -d '{"model": "llava:7b"}'
   
   curl -X POST https://your-app.railway.app/pull \\
     -H "Content-Type: application/json" \\
     -d '{"model": "llama3.2:3b"}'
   \`\`\`

4. **Configure Your App:**
   Add to your Vercel environment variables:
   \`\`\`env
   ETHOS_AI_URL=https://your-app.railway.app
   \`\`\`

## API Endpoints

- \`GET /health\` - Health check
- \`POST /chat\` - Main chat endpoint
- \`GET /models\` - List available models
- \`POST /pull\` - Pull a model

## Usage

\`\`\`typescript
const response = await fetch('https://your-app.railway.app/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: 'Your prompt here',
    model_override: 'llava-7b'
  })
})
\`\`\`
`
fs.writeFileSync(path.join(deployDir, 'README.md'), readmeContent)

console.log('✅ Created deployment files')

// Create .gitignore
const gitignoreContent = `__pycache__/
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
.env
.venv
pip-log.txt
pip-delete-this-directory.txt
.tox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.log
.git
.mypy_cache
.pytest_cache
.hypothesis
`
fs.writeFileSync(path.join(deployDir, '.gitignore'), gitignoreContent)

console.log('\n📋 Next Steps:')
console.log('==============')
console.log('1. Navigate to the deployment directory:')
console.log(`   cd ${deployDir}`)
console.log('')
console.log('2. Initialize git repository:')
console.log('   git init')
console.log('   git add .')
console.log('   git commit -m "Initial Ethos AI deployment"')
console.log('')
console.log('3. Create a new repository on GitHub and push:')
console.log('   git remote add origin https://github.com/yourusername/ethos-ai-railway.git')
console.log('   git push -u origin main')
console.log('')
console.log('4. Deploy to Railway:')
console.log('   - Go to https://railway.app')
console.log('   - Create new project from GitHub')
console.log('   - Select your ethos-ai-railway repository')
console.log('   - Add environment variables:')
console.log('     OLLAMA_HOST=0.0.0.0')
console.log('     OLLAMA_PORT=11434')
console.log('')
console.log('5. After deployment, pull the required models:')
console.log('   curl -X POST https://your-app.railway.app/pull \\')
console.log('     -H "Content-Type: application/json" \\')
console.log('     -d \'{"model": "llava:7b"}\'')
console.log('')
console.log('6. Update your Vercel environment variables:')
console.log('   ETHOS_AI_URL=https://your-app.railway.app')
console.log('')
console.log('🎉 Your Ethos AI will be ready to use with your Cooking With! app!')

console.log('\n📁 Deployment files created in:', deployDir)
console.log('\n💡 Tip: You can also use Render or DigitalOcean App Platform as alternatives to Railway.')

@echo off
echo 🍳 Starting Ethos-AI Backend for Cooking With! Chat Feature
echo.

cd "C:\Users\cooli\OneDrive\Desktop\Documents\GitHub\Ethos-AI\backend"

echo 📦 Installing dependencies...
pip install -r requirements.txt

echo 🚀 Starting Ethos-AI backend...
echo.
echo ✅ Backend will be available at: http://localhost:8000
echo ✅ Cooking chat will use this backend automatically
echo.
echo Press Ctrl+C to stop the server
echo.

python simple_main.py

pause

# 🔧 Fix Cooking Chat 500 Error - Step by Step

## ✅ **Railway Deployment Complete!**

Your Cooking Ethos AI is successfully deployed on Railway at:
**🌐 https://cooking-ethos-ai-production-6bfd.up.railway.app**

## ❌ **Current Problem**

Your Cooking With! app is still getting 500 errors because it doesn't know where to find the Cooking Ethos AI. You need to connect them.

## 🚀 **Fix Steps (Do This Now)**

### **Step 1: Add Environment Variable to Vercel**

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Find your "Cooking With!" project

2. **Add Environment Variable**
   - Click on your project
   - Go to **Settings** → **Environment Variables**
   - Click **Add New**
   - **Name**: `COOKING_ETHOS_AI_URL`
   - **Value**: `https://cooking-ethos-ai-production-6bfd.up.railway.app`
   - **Environment**: Select **Production** (and Preview if you want)
   - Click **Save**

### **Step 2: Redeploy Your Vercel App**

1. **Trigger Redeploy**
   - Go to **Deployments** tab
   - Click **Redeploy** on your latest deployment
   - Or push a new commit to GitHub to trigger auto-deploy

2. **Wait for Deployment**
   - Wait for the deployment to complete
   - This will pick up the new environment variable

### **Step 3: Test the Cooking Chat**

1. **Visit Your App**
   - Go to: https://cooking-with-psi.vercel.app
   - Navigate to the Cooking Chat

2. **Test the Chat**
   - Try asking: "How to cook chicken breast"
   - Should now work without 500 errors!

## 🔍 **What's Happening**

- ✅ **Railway**: Cooking Ethos AI is running perfectly
- ✅ **Vercel**: Cooking With! app is running perfectly  
- ❌ **Connection**: They don't know about each other
- 🔧 **Fix**: Environment variable connects them

## 🎯 **Expected Result**

After following these steps:
- ✅ No more 500 errors
- ✅ Cooking chat works perfectly
- ✅ Users get instant cooking assistance
- ✅ Zero server setup required

## 📞 **If Still Having Issues**

1. **Check Environment Variable**
   - Make sure it's exactly: `COOKING_ETHOS_AI_URL=https://cooking-ethos-ai-production-6bfd.up.railway.app`

2. **Verify Redeploy**
   - Make sure you redeployed after adding the environment variable

3. **Test Railway Directly**
   - Visit: https://cooking-ethos-ai-production-6bfd.up.railway.app/health
   - Should return: `{"status": "healthy", "service": "Cooking Ethos AI"}`

## 🎉 **Success!**

Once you complete these steps, your cooking chat will work perfectly and users will have instant access to cooking assistance without any technical setup!

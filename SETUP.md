# 🍳 Cooking With! - Setup Guide

## 📋 Prerequisites
- Node.js 18+
- Git
- A GitHub account
- A Supabase account (already configured)

## 🔧 Environment Setup

### 1. Create Environment Variables File

Create a `.env.local` file in your project root with the following content:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://aenfbkvdazgcnizdqlrs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlbmZia3ZkYXpnY25pemRxbHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMTI0NDUsImV4cCI6MjA2OTU4ODQ0NX0.rCXbPSGIsITmVC9LFT36nzmYE3b5ALKFpb6cni2Ajmk

# NextAuth Configuration
NEXTAUTH_SECRET=generate-a-random-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Optional: For production deployment
# NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 2. Generate NextAuth Secret

To generate a secure secret for NextAuth, run:
```bash
openssl rand -base64 32
```

Or use this online generator: https://generate-secret.vercel.app/32

## 🗄️ Database Setup

Your Supabase database is already configured with:

### ✅ Database Schema Created
- **Users** - User accounts with roles (viewer/publisher/admin)
- **Recipes** - Recipe storage with ingredients, instructions, ratings
- **Newsletters** - Article content and publishing system
- **Categories** - Recipe categorization
- **Tags** - Flexible tagging system
- **Ratings & Reviews** - User feedback system
- **Favorites** - User recipe bookmarking
- **Subscriptions** - Newsletter email subscriptions

### ✅ Initial Data Added
- 16 Recipe categories (Appetizer, Main Course, Dessert, etc.)
- 35 Popular tags (vegetarian, vegan, gluten-free, etc.)

## 🚀 Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Visit your app:**
   Open [http://localhost:3000](http://localhost:3000)

## 📊 Database Features Ready to Use

### User Management
- Registration with role selection (viewer/publisher)
- Authentication system
- Profile management

### Recipe System
- Recipe creation with full ingredient lists
- Step-by-step instructions
- Photo uploads (when implemented)
- Rating and review system
- Search and filtering
- Categorization and tagging

### Newsletter Platform
- Article creation and publishing
- Rich text content
- Featured articles
- Category-based organization

## 🔗 Useful Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/aenfbkvdazgcnizdqlrs
- **Database URL**: https://aenfbkvdazgcnizdqlrs.supabase.co
- **Documentation**: See README.md for detailed feature information

## 🚨 Important Notes

1. **Path Issue**: The folder name "Cooking With!" contains an exclamation mark which may cause build issues. Consider renaming to "cooking-with" if you encounter problems.

2. **Environment Variables**: Never commit `.env.local` to version control (it's already in .gitignore).

3. **Database Security**: The provided anon key is safe for client-side use and only allows operations you've authorized.

## 🆘 Troubleshooting

### Build Errors
If you see webpack errors about the exclamation mark in the path:
```bash
# Rename the folder to avoid special characters
mv "Cooking With!" cooking-with
cd cooking-with
```

### Database Connection Issues
- Verify your `.env.local` file has the correct variables
- Check that your Supabase project is active
- Ensure the anon key hasn't expired

### Development Server Issues
```bash
# Clear Next.js cache and restart
rm -rf .next
npm run dev
```

Ready to start cooking? 🍳✨ 
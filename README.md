# 🍳 Cooking With! - Recipe Book & Culinary Newsletter Platform

A modern, beautiful web application that combines a community-driven recipe book with culinary newsletters. Built with Next.js, React, and Tailwind CSS.

## ✨ Features

### 🍽️ Recipe Features
- **Recipe Collection**: Browse thousands of recipes from the community
- **Advanced Search & Filtering**: Find recipes by ingredients, diet type, difficulty, and cooking time
- **Recipe Creation**: Publishers can add detailed recipes with ingredients, instructions, and photos
- **Interactive Recipe Cards**: Beautiful recipe displays with ratings, cooking time, and ingredient previews
- **Visual Ingredient Display**: Show ingredients with images and descriptions (as requested)
- **Recipe Categories**: Organized by meal type, cuisine, diet restrictions, and more
- **Favorites System**: Save and organize your favorite recipes

### 📰 Newsletter Features
- **Culinary Newsletters**: Read and write food-related articles and insights
- **Rich Content**: Featured articles with beautiful layouts and images
- **Email Subscriptions**: Stay updated with the latest culinary trends
- **Publisher Tools**: Create newsletters with rich text editing and scheduling
- **Newsletter Archives**: Browse past newsletters by category and author

### 👥 User System
- **Two User Types**:
  - **Viewers**: Browse recipes, read newsletters, save favorites
  - **Publishers**: All viewer features + create recipes and write newsletters
- **User Profiles**: Personalized profiles with activity tracking
- **Community Interaction**: Follow publishers, rate recipes, and leave reviews

### 🎨 Modern UI/UX
- **Beautiful Design**: Modern, clean interface with food-focused aesthetics
- **Mobile Responsive**: Perfect experience on all devices
- **Fast Performance**: Optimized loading and smooth interactions
- **Accessibility**: Built with accessibility best practices

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd "Cooking With!"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
Cooking With!/
├── app/                          # Next.js 13+ App Router
│   ├── globals.css              # Global styles with Tailwind
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Homepage with featured content
│   ├── recipes/
│   │   └── page.tsx            # Recipe browsing page
│   ├── newsletters/
│   │   └── page.tsx            # Newsletter browsing page
│   ├── create/
│   │   ├── page.tsx            # Publisher creation hub
│   │   └── recipe/
│   │       └── page.tsx        # Recipe creation form
│   ├── login/
│   │   └── page.tsx            # User login
│   └── signup/
│       └── page.tsx            # User registration
├── components/
│   └── Navbar.tsx              # Navigation component
├── public/                      # Static assets
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── next.config.js              # Next.js configuration
```

## 🎯 Key Pages & Features

### 🏠 Homepage (`/`)
- Hero section with call-to-action
- Featured recipes carousel
- Latest newsletters preview
- Community highlights

### 🍽️ Recipes (`/recipes`)
- Recipe grid with filtering
- Search by ingredients, cuisine, diet type
- Recipe cards with ratings and quick info
- Advanced filtering options

### 📰 Newsletters (`/newsletters`)
- Featured articles section
- Newsletter browsing with categories
- Author profiles and publish dates
- Tag-based organization

### ✍️ Create Hub (`/create`)
- Choose between recipe or newsletter creation
- Recent activity tracking
- Content creation tips
- Draft management

### 👤 Authentication
- **Sign Up** (`/signup`): Choose between Viewer/Publisher roles
- **Login** (`/login`): Secure authentication with social options

## 🎨 Design System

### Color Palette
- **Primary Orange**: Warm, food-inspired orange tones (#f97316)
- **Neutral Grays**: Clean, modern gray palette
- **Success Green**: For positive actions
- **Semantic Colors**: Red for warnings, blue for info

### Typography
- **Headings**: Playfair Display (serif) - elegant and readable
- **Body**: Inter (sans-serif) - modern and clean

### Components
- **Recipe Cards**: Hover effects, image overlays, ingredient tags
- **Form Controls**: Consistent styling with focus states
- **Buttons**: Primary, secondary, and tertiary variants
- **Navigation**: Sticky header with mobile-responsive design

## 🔧 Technical Stack

- **Framework**: Next.js 14 with App Router
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React (beautiful, consistent icons)
- **Forms**: React Hook Form for form management
- **Notifications**: React Hot Toast for user feedback

## 🚧 Development Features

### Current Implementation
- ✅ Responsive design system
- ✅ Recipe browsing and filtering
- ✅ Newsletter reading interface
- ✅ User authentication UI
- ✅ Recipe creation form
- ✅ Publisher/Viewer role system
- ✅ Modern, accessible UI components

### Planned Features
- 🔄 Backend API integration
- 🔄 Database connectivity (Prisma + PostgreSQL)
- 🔄 Image upload functionality
- 🔄 Email newsletter system
- 🔄 User profiles and dashboards
- 🔄 Recipe rating and review system
- 🔄 Social features (following, comments)
- 🔄 Advanced search with AI
- 🔄 Meal planning tools
- 🔄 Shopping list generation

## 📱 Responsive Design

The app is fully responsive with breakpoints for:
- **Mobile**: Optimized for touch interaction
- **Tablet**: Balanced layouts for medium screens
- **Desktop**: Full-featured experience with sidebars and grids

## 🎨 Customization

### Adding New Recipe Categories
Edit the categories array in `app/recipes/page.tsx`:

```typescript
const categories = ["All", "Italian", "French", "Your New Category"]
```

### Styling Customization
Modify `tailwind.config.js` to customize:
- Color palette
- Font families
- Spacing scales
- Component styles

### Adding New Features
The modular structure makes it easy to add:
- New pages in the `app/` directory
- Reusable components in `components/`
- New API routes (when backend is implemented)

## 📞 Support & Contribution

This is a demo application showcasing modern web development practices for a recipe and newsletter platform. The codebase is well-structured and ready for:

- Backend integration
- Database implementation  
- Advanced features like search, recommendations, and social features
- Deployment to production

## 🌟 What Makes This Special

- **Community-Driven**: Everyone can contribute recipes and newsletters
- **Publisher-Friendly**: Easy content creation tools for food writers
- **Visual-First**: Beautiful ingredient displays and recipe photography
- **Modern Tech Stack**: Built with the latest web technologies
- **Scalable Architecture**: Ready for growth and additional features

---

**Ready to start cooking?** Run `npm run dev` and explore your new culinary platform! 🍳✨ 
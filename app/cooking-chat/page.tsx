import React from 'react'
import CookingChat from '@/components/CookingChat'
import { ChefHatIcon, LightbulbIcon, BookOpenIcon, ShieldIcon } from 'lucide-react'

export default function CookingChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <ChefHatIcon className="h-12 w-12 text-primary-500" />
            <h1 className="text-4xl font-bold text-gray-900">Cooking Assistant</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your AI-powered cooking companion. Get expert advice on recipes, techniques, 
            ingredient substitutions, food safety, and more!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="h-[600px]">
              <CookingChat />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Tips */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <LightbulbIcon className="h-5 w-5 text-yellow-500 mr-2" />
                Quick Tips
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Seasoning:</strong> Salt enhances flavors, add it in layers while cooking
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Temperature:</strong> Always use a food thermometer for safety
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Prep:</strong> Mise en place - prep all ingredients before cooking
                  </p>
                </div>
              </div>
            </div>

            {/* Popular Topics */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpenIcon className="h-5 w-5 text-primary-500 mr-2" />
                Popular Topics
              </h3>
              <div className="space-y-2">
                {[
                  "How to cook chicken breast",
                  "Pasta cooking techniques",
                  "Ingredient substitutions",
                  "Safe cooking temperatures",
                  "Knife skills and safety",
                  "Baking basics",
                  "Meal planning tips",
                  "Seasoning and spices"
                ].map((topic, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => {
                      // This would trigger a message in the chat
                      console.log('Topic clicked:', topic)
                    }}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Safety Reminder */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ShieldIcon className="h-5 w-5 text-red-500 mr-2" />
                Safety First
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Always wash hands before cooking</p>
                <p>• Use separate cutting boards for raw meat</p>
                <p>• Cook meat to safe internal temperatures</p>
                <p>• Keep hot foods hot and cold foods cold</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What I Can Help You With
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🍳",
                title: "Cooking Techniques",
                description: "Learn proper cooking methods, knife skills, and kitchen techniques"
              },
              {
                icon: "📝",
                title: "Recipe Guidance",
                description: "Get help with recipe modifications, substitutions, and troubleshooting"
              },
              {
                icon: "🥘",
                title: "Ingredient Help",
                description: "Find substitutes, understand ingredients, and learn about nutrition"
              },
              {
                icon: "🛡️",
                title: "Food Safety",
                description: "Learn about safe cooking temperatures, storage, and kitchen hygiene"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

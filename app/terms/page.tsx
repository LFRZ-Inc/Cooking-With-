import React from 'react'
import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 prose prose-lg max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Cooking With ("the Platform"), you accept and agree to be bound by the terms and 
            provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Cooking With is a community-driven platform where users can share, discover, and explore recipes and 
            culinary content. Our platform provides tools for recipe creation, editing, rating, and community interaction.
          </p>

          <h2>3. User Content and Responsibility</h2>
          <h3>3.1 Recipe Attribution</h3>
          <p>
            When sharing recipes, users must properly attribute original creators and respect culinary heritage. 
            Our platform maintains editorial transparency by tracking original publication dates and modifications.
          </p>
          
          <h3>3.2 Content Ownership</h3>
          <p>
            Users retain ownership of their original content but grant Cooking With a license to display, 
            distribute, and promote their recipes and articles on the platform.
          </p>

          <h3>3.3 User Responsibility</h3>
          <p>You are responsible for:</p>
          <ul>
            <li>Ensuring recipe accuracy and food safety</li>
            <li>Respecting intellectual property rights</li>
            <li>Providing proper attribution for traditional or adapted recipes</li>
            <li>Not sharing harmful, offensive, or inappropriate content</li>
          </ul>

          <h2>4. Privacy and Data Protection</h2>
          <p>
            We are committed to protecting your privacy. All uploaded images are automatically processed to remove 
            location data and metadata. For full details, see our <Link href="/privacy" className="text-blue-600 hover:text-blue-700">Privacy Policy</Link>.
          </p>

          <h2>5. Account Management</h2>
          <p>
            Users can edit and delete their own content at any time. We maintain transparent modification tracking 
            to preserve culinary integrity and proper attribution.
          </p>

          <h2>6. Prohibited Activities</h2>
          <p>Users may not:</p>
          <ul>
            <li>Upload copyrighted content without permission</li>
            <li>Share recipes that may cause harm if followed</li>
            <li>Misrepresent the origin or cultural significance of dishes</li>
            <li>Engage in spam, harassment, or abusive behavior</li>
            <li>Attempt to access other users' accounts or data</li>
          </ul>

          <h2>7. Content Moderation</h2>
          <p>
            Cooking With reserves the right to review, moderate, and remove content that violates these terms. 
            We strive to maintain a respectful and educational culinary community.
          </p>

          <h2>8. Culinary Heritage and Attribution</h2>
          <p>
            We respect the cultural origins of recipes and encourage users to acknowledge traditional sources, 
            regional variations, and historical context when sharing dishes from various culinary traditions.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            Cooking With is not responsible for the accuracy of user-submitted recipes or any consequences 
            of following them. Users cook at their own risk and should use judgment regarding food safety and allergies.
          </p>

          <h2>10. Modifications to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be posted on this page with 
            an updated date. Continued use of the platform constitutes acceptance of modified terms.
          </p>

          <h2>11. Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us:
          </p>
          <ul>
            <li>TikTok: <a href="https://tiktok.com/@earthtoluis" target="_blank" rel="noopener" className="text-blue-600 hover:text-blue-700">@earthtoluis</a></li>
            <li>Platform: Through your account dashboard</li>
          </ul>

          <h2>12. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with applicable laws. 
            Any disputes shall be resolved through appropriate legal channels.
          </p>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              By using Cooking With, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 
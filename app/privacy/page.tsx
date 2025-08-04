import React from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, ShieldIcon } from 'lucide-react'

export default function PrivacyPolicy() {
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
          <div className="flex items-center space-x-3 mb-4">
            <ShieldIcon className="h-8 w-8 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Privacy Commitment Banner */}
        <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <ShieldIcon className="h-6 w-6 text-green-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">Our Privacy Commitment</h3>
              <p className="text-green-800">
                Cooking With is designed with privacy first. We automatically strip location data from all images, 
                collect only essential information, and never sell your personal data.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 prose prose-lg max-w-none">
          <h2>1. Information We Collect</h2>
          
          <h3>1.1 Account Information</h3>
          <p>When you create an account, we collect:</p>
          <ul>
            <li>Email address (for account access and notifications)</li>
            <li>Username/display name</li>
            <li>Account creation date</li>
          </ul>

          <h3>1.2 Content You Create</h3>
          <ul>
            <li>Recipes and cooking instructions</li>
            <li>Articles and blog posts</li>
            <li>Comments and ratings</li>
            <li>Images (automatically processed for privacy - see section 3)</li>
          </ul>

          <h3>1.3 Usage Analytics</h3>
          <p>We collect basic, non-personal usage statistics to improve the platform:</p>
          <ul>
            <li>Page views and interaction patterns</li>
            <li>Feature usage statistics</li>
            <li>Error logs for technical improvements</li>
          </ul>

          <h2>2. What We DON'T Collect</h2>
          <div className="bg-red-50 border border-red-200 rounded p-4 my-4">
            <h3 className="text-red-900 mt-0">We explicitly do NOT collect:</h3>
            <ul className="text-red-800">
              <li>❌ Location data from images (automatically stripped)</li>
              <li>❌ Camera information or device metadata</li>
              <li>❌ Your real name (unless you choose to share it)</li>
              <li>❌ Phone numbers or addresses</li>
              <li>❌ Browsing history outside our platform</li>
              <li>❌ Third-party social media data</li>
            </ul>
          </div>

          <h2>3. Image Privacy Protection</h2>
          <div className="bg-blue-50 border border-blue-200 rounded p-4 my-4">
            <h3 className="text-blue-900 mt-0">🔒 Automatic Privacy Protection</h3>
            <p className="text-blue-800">
              <strong>All uploaded images are automatically processed to remove:</strong>
            </p>
            <ul className="text-blue-800">
              <li>GPS location data</li>
              <li>Camera make and model</li>
              <li>Date and time stamps</li>
              <li>Camera settings (ISO, aperture, etc.)</li>
              <li>Any other embedded metadata (EXIF data)</li>
            </ul>
            <p className="text-blue-800">
              This happens automatically before your image is stored, ensuring your privacy is protected.
            </p>
          </div>

          <h2>4. How We Use Your Information</h2>
          <p>We use your information only for:</p>
          <ul>
            <li>Providing and improving the cooking platform</li>
            <li>Enabling you to share and discover recipes</li>
            <li>Sending account-related notifications (if enabled)</li>
            <li>Maintaining platform security and preventing abuse</li>
            <li>Preserving culinary attribution and recipe history</li>
          </ul>

          <h2>5. Information Sharing</h2>
          <h3>5.1 What We Share</h3>
          <ul>
            <li>Your public recipes and articles (as intended by the platform)</li>
            <li>Your username on content you create</li>
            <li>Aggregated, anonymous usage statistics for platform improvement</li>
          </ul>

          <h3>5.2 What We Never Share</h3>
          <ul>
            <li>Your email address</li>
            <li>Private account information</li>
            <li>Usage patterns linked to your identity</li>
            <li>Any personal data with advertisers or third parties</li>
          </ul>

          <h2>6. Data Security</h2>
          <p>We protect your data through:</p>
          <ul>
            <li>Encrypted data transmission (HTTPS)</li>
            <li>Secure database storage with access controls</li>
            <li>Regular security audits and updates</li>
            <li>Limited employee access on a need-to-know basis</li>
          </ul>

          <h2>7. Your Rights and Control</h2>
          <h3>7.1 Account Management</h3>
          <ul>
            <li>Edit or delete your recipes and articles at any time</li>
            <li>Update your account information</li>
            <li>Control notification preferences</li>
            <li>Download your data</li>
          </ul>

          <h3>7.2 Data Deletion</h3>
          <p>
            You can delete your account and all associated data at any time through your account settings. 
            Upon deletion, we remove all personal information while preserving anonymous recipe contributions 
            to maintain the community knowledge base.
          </p>

          <h2>8. Cookies and Tracking</h2>
          <p>We use minimal, essential cookies for:</p>
          <ul>
            <li>Keeping you logged in</li>
            <li>Remembering your preferences</li>
            <li>Basic analytics (anonymous)</li>
          </ul>
          <p>We do not use tracking cookies for advertising or share data with ad networks.</p>

          <h2>9. Children's Privacy</h2>
          <p>
            Our platform is designed for general audiences. We do not knowingly collect personal information 
            from children under 13. If you believe a child has provided personal information, please contact us 
            to have it removed.
          </p>

          <h2>10. International Users</h2>
          <p>
            By using Cooking With, you consent to the transfer and processing of your information in accordance 
            with this privacy policy, regardless of your location.
          </p>

          <h2>11. Changes to Privacy Policy</h2>
          <p>
            We will notify users of material changes to this privacy policy by posting updates on this page 
            and updating the "last modified" date. Continued use constitutes acceptance of changes.
          </p>

          <h2>12. Contact Us</h2>
          <p>Questions about privacy or data handling?</p>
          <ul>
            <li>TikTok: <a href="https://tiktok.com/@earthtoluis" target="_blank" rel="noopener" className="text-blue-600 hover:text-blue-700">@earthtoluis</a></li>
            <li>Platform: Use the contact form in your account dashboard</li>
          </ul>

          <div className="mt-12 pt-8 border-t border-gray-200 bg-gray-50 rounded p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary: Your Privacy Matters</h3>
            <p className="text-gray-700 text-sm">
              Cooking With is built on the principle that sharing recipes shouldn't compromise your privacy. 
              We collect only what's necessary, protect what we have, and give you full control over your data. 
              Your location, personal details, and browsing habits stay private.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 
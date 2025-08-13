'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, ShieldIcon } from 'lucide-react'
import { useLanguage } from '@/lib/language'

export default function PrivacyPolicy() {
  const { t } = useLanguage()
  
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
            {t('legal.backToHome')}
          </Link>
          <div className="flex items-center space-x-3 mb-4">
            <ShieldIcon className="h-8 w-8 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">{t('legal.privacyPolicy')}</h1>
          </div>
          <p className="text-gray-600">{t('legal.lastUpdated')} {new Date().toLocaleDateString()}</p>
        </div>

        {/* Privacy Commitment Banner */}
        <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <ShieldIcon className="h-6 w-6 text-green-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">{t('legal.privacyCommitment')}</h3>
              <p className="text-green-800">
                {t('legal.privacyCommitmentText')}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 prose prose-lg max-w-none">
          <h2>{t('legal.informationWeCollect')}</h2>
          
          <h3>{t('legal.accountInformation')}</h3>
          <p>{t('legal.accountInfoText')}</p>
          <ul>
            <li>{t('legal.emailAddress')}</li>
            <li>{t('legal.username')}</li>
            <li>{t('legal.accountCreationDate')}</li>
          </ul>

          <h3>{t('legal.contentYouCreate')}</h3>
          <ul>
            <li>{t('legal.recipesAndInstructions')}</li>
            <li>{t('legal.articlesAndPosts')}</li>
            <li>{t('legal.commentsAndRatings')}</li>
            <li>{t('legal.images')}</li>
          </ul>

          <h3>{t('legal.usageAnalytics')}</h3>
          <p>{t('legal.usageAnalyticsText')}</p>
          <ul>
            <li>{t('legal.pageViews')}</li>
            <li>{t('legal.featureUsage')}</li>
            <li>{t('legal.errorLogs')}</li>
          </ul>

          <h2>{t('legal.whatWeDontCollect')}</h2>
          <div className="bg-red-50 border border-red-200 rounded p-4 my-4">
            <h3 className="text-red-900 mt-0">{t('legal.weExplicitlyDontCollect')}</h3>
            <ul className="text-red-800">
              <li>{t('legal.noLocationData')}</li>
              <li>{t('legal.noCameraInfo')}</li>
              <li>{t('legal.noRealName')}</li>
              <li>{t('legal.noPhoneNumbers')}</li>
              <li>{t('legal.noBrowsingHistory')}</li>
              <li>{t('legal.noSocialMediaData')}</li>
            </ul>
          </div>

          <h2>{t('legal.imagePrivacyProtection')}</h2>
          <div className="bg-blue-50 border border-blue-200 rounded p-4 my-4">
            <h3 className="text-blue-900 mt-0">{t('legal.automaticPrivacyProtection')}</h3>
            <p className="text-blue-800">
              <strong>{t('legal.allUploadedImages')}</strong>
            </p>
            <ul className="text-blue-800">
              <li>{t('legal.gpsLocationData')}</li>
              <li>{t('legal.cameraMakeModel')}</li>
              <li>{t('legal.dateTimeStamps')}</li>
              <li>{t('legal.cameraSettings')}</li>
              <li>{t('legal.embeddedMetadata')}</li>
            </ul>
            <p className="text-blue-800">
              {t('legal.automaticProcessing')}
            </p>
          </div>

          <h2>{t('legal.howWeUseInformation')}</h2>
          <p>{t('legal.weUseInformationFor')}</p>
          <ul>
            <li>{t('legal.providingPlatform')}</li>
            <li>{t('legal.sharingRecipes')}</li>
            <li>{t('legal.accountNotifications')}</li>
            <li>{t('legal.platformSecurity')}</li>
            <li>{t('legal.preservingAttribution')}</li>
          </ul>

          <h2>{t('legal.informationSharing')}</h2>
          <h3>{t('legal.whatWeShare')}</h3>
          <ul>
            <li>{t('legal.publicRecipes')}</li>
            <li>{t('legal.usernameOnContent')}</li>
            <li>{t('legal.aggregatedStats')}</li>
          </ul>

          <h3>{t('legal.whatWeNeverShare')}</h3>
          <ul>
            <li>{t('legal.emailAddress')}</li>
            <li>{t('legal.privateAccountInfo')}</li>
            <li>{t('legal.usagePatterns')}</li>
            <li>{t('legal.personalDataWithAdvertisers')}</li>
          </ul>

          <h2>{t('legal.dataSecurity')}</h2>
          <p>{t('legal.weProtectDataThrough')}</p>
          <ul>
            <li>{t('legal.encryptedTransmission')}</li>
            <li>{t('legal.secureDatabase')}</li>
            <li>{t('legal.securityAudits')}</li>
            <li>{t('legal.limitedAccess')}</li>
          </ul>

          <h2>{t('legal.yourRightsAndControl')}</h2>
          <h3>{t('legal.accountManagement')}</h3>
          <ul>
            <li>{t('legal.editDeleteContent')}</li>
            <li>{t('legal.updateAccountInfo')}</li>
            <li>{t('legal.controlNotifications')}</li>
            <li>{t('legal.downloadData')}</li>
          </ul>

          <h3>{t('legal.dataDeletion')}</h3>
          <p>
            {t('legal.dataDeletionText')}
          </p>

          <h2>{t('legal.cookiesAndTracking')}</h2>
          <p>{t('legal.weUseMinimalCookies')}</p>
          <ul>
            <li>{t('legal.keepingLoggedIn')}</li>
            <li>{t('legal.rememberingPreferences')}</li>
            <li>{t('legal.basicAnalytics')}</li>
          </ul>
          <p>{t('legal.noTrackingCookies')}</p>

          <h2>{t('legal.childrensPrivacy')}</h2>
          <p>
            {t('legal.childrensPrivacyText')}
          </p>

          <h2>{t('legal.internationalUsers')}</h2>
          <p>
            {t('legal.internationalUsersText')}
          </p>

          <h2>{t('legal.changesToPrivacyPolicy')}</h2>
          <p>
            {t('legal.changesToPrivacyText')}
          </p>

          <h2>{t('legal.contactUs')}</h2>
          <p>{t('legal.questionsAboutPrivacy')}</p>
          <ul>
            <li>{t('legal.tiktok')} <a href="https://tiktok.com/@earthtoluis" target="_blank" rel="noopener" className="text-blue-600 hover:text-blue-700">@earthtoluis</a></li>
            <li>{t('legal.platform')} {t('legal.useContactForm')}</li>
          </ul>

          <div className="mt-12 pt-8 border-t border-gray-200 bg-gray-50 rounded p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('legal.summaryYourPrivacyMatters')}</h3>
            <p className="text-gray-700 text-sm">
              {t('legal.summaryText')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 
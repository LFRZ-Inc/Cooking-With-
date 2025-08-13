'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'
import { useLanguage } from '@/lib/language'

export default function TermsOfService() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('legal.termsOfService')}</h1>
          <p className="text-gray-600">{t('legal.lastUpdated')} {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 prose prose-lg max-w-none">
          <h2>{t('legal.acceptanceOfTerms')}</h2>
          <p>
            {t('legal.acceptanceText')}
          </p>

          <h2>{t('legal.descriptionOfService')}</h2>
          <p>
            {t('legal.descriptionText')}
          </p>

          <h2>{t('legal.userContentAndResponsibility')}</h2>
          <h3>{t('legal.recipeAttribution')}</h3>
          <p>
            {t('legal.recipeAttributionText')}
          </p>
          
          <h3>{t('legal.contentOwnership')}</h3>
          <p>
            {t('legal.contentOwnershipText')}
          </p>

          <h3>{t('legal.userResponsibility')}</h3>
          <p>{t('legal.userResponsibilityText')}</p>
          <ul>
            <li>{t('legal.recipeAccuracy')}</li>
            <li>{t('legal.intellectualProperty')}</li>
            <li>{t('legal.properAttribution')}</li>
            <li>{t('legal.noHarmfulContent')}</li>
          </ul>

          <h2>{t('legal.privacyAndDataProtection')}</h2>
          <p>
            {t('legal.privacyText')} <Link href="/privacy" className="text-blue-600 hover:text-blue-700">{t('legal.privacyPolicy')}</Link>.
          </p>

          <h2>{t('legal.accountManagement')}</h2>
          <p>
            {t('legal.accountManagementText')}
          </p>

          <h2>{t('legal.prohibitedActivities')}</h2>
          <p>{t('legal.prohibitedActivitiesText')}</p>
          <ul>
            <li>{t('legal.noCopyrightedContent')}</li>
            <li>{t('legal.noHarmfulRecipes')}</li>
            <li>{t('legal.noMisrepresentation')}</li>
            <li>{t('legal.noSpam')}</li>
            <li>{t('legal.noUnauthorizedAccess')}</li>
          </ul>

          <h2>{t('legal.contentModeration')}</h2>
          <p>
            {t('legal.contentModerationText')}
          </p>

          <h2>{t('legal.culinaryHeritage')}</h2>
          <p>
            {t('legal.culinaryHeritageText')}
          </p>

          <h2>{t('legal.limitationOfLiability')}</h2>
          <p>
            {t('legal.limitationText')}
          </p>

          <h2>{t('legal.modificationsToTerms')}</h2>
          <p>
            {t('legal.modificationsText')}
          </p>

          <h2>{t('legal.contactInformation')}</h2>
          <p>
            {t('legal.contactText')}
          </p>
          <ul>
            <li>{t('legal.tiktok')} <a href="https://tiktok.com/@earthtoluis" target="_blank" rel="noopener" className="text-blue-600 hover:text-blue-700">@earthtoluis</a></li>
            <li>{t('legal.platform')} {t('legal.throughAccountDashboard')}</li>
          </ul>

          <h2>{t('legal.governingLaw')}</h2>
          <p>
            {t('legal.governingLawText')}
          </p>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {t('legal.acknowledgment')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 
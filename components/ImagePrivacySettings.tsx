import React from 'react'
import { Switch } from '@headlessui/react'
import { CameraIcon, MapPinIcon, ClockIcon, SmartphoneIcon } from 'lucide-react'
import { useLanguage } from '@/lib/language'

interface ImagePrivacySettingsProps {
  settings: {
    keepLocation: boolean
    keepCameraInfo: boolean
    keepTimestamp: boolean
    keepDeviceInfo: boolean
  }
  onChange: (settings: {
    keepLocation: boolean
    keepCameraInfo: boolean
    keepTimestamp: boolean
    keepDeviceInfo: boolean
  }) => void
}

export default function ImagePrivacySettings({ settings, onChange }: ImagePrivacySettingsProps) {
  const { t } = useLanguage()
  const handleToggle = (setting: keyof typeof settings) => {
    onChange({
      ...settings,
      [setting]: !settings[setting]
    })
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{t('account.photoPrivacySettings')}</h3>
        <div className="text-sm text-gray-500">
          {t('account.allSettingsOff')}
        </div>
      </div>

      {/* Location Data */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <MapPinIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium">{t('account.locationData')}</div>
            <div className="text-sm text-gray-500">
              {t('account.allowPhotosLocation')}
            </div>
          </div>
        </div>
        <Switch
          checked={settings.keepLocation}
          onChange={() => handleToggle('keepLocation')}
          className={`${
            settings.keepLocation ? 'bg-blue-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
        >
          <span className="sr-only">Keep location data in photos</span>
          <span
            className={`${
              settings.keepLocation ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>

      {/* Camera Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <CameraIcon className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <div className="font-medium">{t('account.cameraInformation')}</div>
            <div className="text-sm text-gray-500">
              {t('account.keepCameraSettings')}
            </div>
          </div>
        </div>
        <Switch
          checked={settings.keepCameraInfo}
          onChange={() => handleToggle('keepCameraInfo')}
          className={`${
            settings.keepCameraInfo ? 'bg-purple-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
        >
          <span className="sr-only">Keep camera information in photos</span>
          <span
            className={`${
              settings.keepCameraInfo ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>

      {/* Timestamp */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-100 p-2 rounded-lg">
            <ClockIcon className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <div className="font-medium">{t('account.photoTimestamps')}</div>
            <div className="text-sm text-gray-500">
              {t('account.keepOriginalDateTime')}
            </div>
          </div>
        </div>
        <Switch
          checked={settings.keepTimestamp}
          onChange={() => handleToggle('keepTimestamp')}
          className={`${
            settings.keepTimestamp ? 'bg-amber-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
        >
          <span className="sr-only">Keep timestamp information in photos</span>
          <span
            className={`${
              settings.keepTimestamp ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>

      {/* Device Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <SmartphoneIcon className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <div className="font-medium">{t('account.deviceInformation')}</div>
            <div className="text-sm text-gray-500">
              {t('account.includeDeviceInfo')}
            </div>
          </div>
        </div>
        <Switch
          checked={settings.keepDeviceInfo}
          onChange={() => handleToggle('keepDeviceInfo')}
          className={`${
            settings.keepDeviceInfo ? 'bg-green-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
        >
          <span className="sr-only">Keep device information in photos</span>
          <span
            className={`${
              settings.keepDeviceInfo ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
        <p className="font-medium mb-2">📸 {t('account.forPhotographers')}</p>
        <p>
          {t('account.photoSettingsDescription')}
        </p>
      </div>
    </div>
  )
} 
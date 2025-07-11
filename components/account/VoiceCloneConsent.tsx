'use client'

import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function VoiceCloneConsent() {
  const [consent, setConsent] = useState(false)
  const [consentDate, setConsentDate] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingConsent, setPendingConsent] = useState(false)

  useEffect(() => {
    fetchConsentStatus()
  }, [])

  const fetchConsentStatus = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('voice_clone_consent, voice_clone_consent_date')
          .eq('id', user.id)
          .single()

        if (profile) {
          setConsent(profile.voice_clone_consent || false)
          setConsentDate(profile.voice_clone_consent_date)
        }
      }
    } catch (error) {
      console.error('Error fetching consent status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConsentChange = (newConsent: boolean) => {
    setPendingConsent(newConsent)
    setShowConfirmDialog(true)
  }

  const confirmConsentChange = async () => {
    setIsSaving(true)
    setShowConfirmDialog(false)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const updateData = pendingConsent
          ? {
              voice_clone_consent: true,
              voice_clone_consent_date: new Date().toISOString(),
            }
          : {
              voice_clone_consent: false,
              voice_clone_consent_date: null,
            }

        const { error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', user.id)

        if (!error) {
          setConsent(pendingConsent)
          setConsentDate(pendingConsent ? new Date().toISOString() : null)
        } else {
          console.error('Error updating consent:', error)
        }
      }
    } catch (error) {
      console.error('Error updating consent:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-border-primary p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-background-secondary rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-background-secondary rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-border-primary p-6">
        <div className="flex items-start space-x-4">
          <Shield className="w-6 h-6 text-sage-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-heading-sm font-medium mb-2">Voice Cloning Consent</h3>
            
            <div className="space-y-4">
              <p className="text-body-sm text-text-secondary">
                Voice cloning technology allows you to generate new audio in your voice from text. 
                This feature requires your explicit consent due to privacy and ethical considerations.
              </p>

              {consent && consentDate && (
                <div className="bg-sage-light/20 rounded-lg p-3 flex items-center space-x-2">
                  <Check className="w-4 h-4 text-sage-primary" />
                  <p className="text-body-sm text-sage-deep">
                    Consent granted on {new Date(consentDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="border border-border-primary rounded-lg p-4 space-y-3">
                <h4 className="text-body-md font-medium flex items-center">
                  <AlertTriangle className="w-4 h-4 text-warm-primary mr-2" />
                  Important Information
                </h4>
                <ul className="space-y-2 text-body-sm text-text-secondary">
                  <li className="flex items-start">
                    <span className="text-warm-primary mr-2">•</span>
                    Your voice data will be processed by third-party AI services
                  </li>
                  <li className="flex items-start">
                    <span className="text-warm-primary mr-2">•</span>
                    Voice profiles are stored securely and can be deleted at any time
                  </li>
                  <li className="flex items-start">
                    <span className="text-warm-primary mr-2">•</span>
                    Generated audio will be clearly marked as synthetic
                  </li>
                  <li className="flex items-start">
                    <span className="text-warm-primary mr-2">•</span>
                    You maintain full ownership of your voice profile and generated content
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => handleConsentChange(e.target.checked)}
                    disabled={isSaving}
                    className="sr-only"
                  />
                  <div className={`
                    relative w-12 h-6 rounded-full transition-colors
                    ${consent ? 'bg-sage-primary' : 'bg-background-tertiary'}
                  `}>
                    <div className={`
                      absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full 
                      shadow-sm transition-transform
                      ${consent ? 'translate-x-6' : 'translate-x-0'}
                    `} />
                  </div>
                  <span className="ml-3 text-body-sm font-medium">
                    I consent to voice cloning
                  </span>
                </label>

                {consent && (
                  <a
                    href="/account/voice-profiles"
                    className="text-body-sm text-sage-primary hover:text-sage-deep"
                  >
                    Manage voice profiles →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-heading-sm font-medium mb-4">
              {pendingConsent ? 'Enable Voice Cloning?' : 'Disable Voice Cloning?'}
            </h3>
            
            {pendingConsent ? (
              <div className="space-y-3 text-body-sm text-text-secondary mb-6">
                <p>By enabling voice cloning, you agree to:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Allow AI processing of your voice recordings</li>
                  <li>• Create voice profiles for text-to-speech generation</li>
                  <li>• Follow ethical guidelines for voice synthesis</li>
                </ul>
                <p className="text-warm-primary">
                  This consent can be revoked at any time.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-body-sm text-text-secondary mb-6">
                <p>Disabling voice cloning will:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Prevent creation of new voice profiles</li>
                  <li>• Disable voice generation features</li>
                  <li>• Keep existing voice profiles (can be deleted separately)</li>
                </ul>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 border border-border-primary rounded-lg text-text-primary hover:bg-background-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmConsentChange}
                className={`
                  px-4 py-2 rounded-lg text-white transition-colors
                  ${pendingConsent 
                    ? 'bg-sage-primary hover:bg-sage-deep' 
                    : 'bg-warm-primary hover:bg-warm-deep'
                  }
                `}
              >
                {pendingConsent ? 'Enable' : 'Disable'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
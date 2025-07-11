'use client'

import { useState, useEffect } from 'react'
import { Shield, Info, AlertCircle, Loader2 } from 'lucide-react'

interface VoiceCloneConsentProps {
  onConsentChange?: (granted: boolean) => void
}

export default function VoiceCloneConsent({ onConsentChange }: VoiceCloneConsentProps) {
  const [consentGranted, setConsentGranted] = useState(false)
  const [consentDate, setConsentDate] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  
  useEffect(() => {
    fetchConsentStatus()
  }, [])
  
  const fetchConsentStatus = async () => {
    try {
      const response = await fetch('/api/voice/consent')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch consent status')
      }
      
      setConsentGranted(data.consent_granted)
      setConsentDate(data.consent_date)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load consent status')
    } finally {
      setIsLoading(false)
    }
  }
  
  const updateConsent = async (grant: boolean) => {
    setIsUpdating(true)
    setError(null)
    
    try {
      const response = await fetch('/api/voice/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consent: grant })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update consent')
      }
      
      setConsentGranted(data.consent_granted)
      setConsentDate(data.consent_date)
      
      if (onConsentChange) {
        onConsentChange(data.consent_granted)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update consent')
    } finally {
      setIsUpdating(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-soft p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-sage-primary" />
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-lg shadow-soft p-6">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-full bg-sage-mist flex items-center justify-center flex-shrink-0">
          <Shield className="w-6 h-6 text-sage-primary" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-serif text-h4 text-sage-deep mb-2">
            Voice Cloning Consent
          </h3>
          
          <p className="text-text-secondary mb-4">
            Voice cloning creates a digital replica of your voice that can generate new speech. 
            Your consent is required to use this feature.
          </p>
          
          {error && (
            <div className="bg-error-light/20 rounded-lg p-4 mb-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-error-primary flex-shrink-0 mt-0.5" />
              <p className="text-error-primary text-body-sm">{error}</p>
            </div>
          )}
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sage-primary hover:text-sage-deep text-body-sm font-medium mb-4 flex items-center space-x-2"
          >
            <Info className="w-4 h-4" />
            <span>{showDetails ? 'Hide' : 'Show'} Details</span>
          </button>
          
          {showDetails && (
            <div className="bg-sage-mist/30 rounded-lg p-4 mb-4 space-y-3">
              <div>
                <h4 className="font-medium text-sage-deep mb-1">What We Do With Your Voice</h4>
                <ul className="text-body-sm text-text-secondary space-y-1 list-disc list-inside">
                  <li>Create a unique voice model based on your recordings</li>
                  <li>Generate new audio in your voice from text you provide</li>
                  <li>Store your voice profile securely with encryption</li>
                  <li>Never share your voice data with third parties</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-sage-deep mb-1">Your Rights</h4>
                <ul className="text-body-sm text-text-secondary space-y-1 list-disc list-inside">
                  <li>Revoke consent at any time</li>
                  <li>Delete your voice profiles and generated audio</li>
                  <li>Export your voice data</li>
                  <li>Control who can access your voice memories</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-sage-deep mb-1">Security & Privacy</h4>
                <ul className="text-body-sm text-text-secondary space-y-1 list-disc list-inside">
                  <li>Voice data is encrypted at rest and in transit</li>
                  <li>Processed using secure, isolated environments</li>
                  <li>Regular security audits and updates</li>
                  <li>Compliant with data protection regulations</li>
                </ul>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-sm text-text-secondary">
                Current status: 
                <span className={`ml-1 font-medium ${consentGranted ? 'text-sage-primary' : 'text-text-light'}`}>
                  {consentGranted ? 'Consent granted' : 'Consent not granted'}
                </span>
              </p>
              {consentDate && (
                <p className="text-caption text-text-light">
                  Since {new Date(consentDate).toLocaleDateString()}
                </p>
              )}
            </div>
            
            <button
              onClick={() => updateConsent(!consentGranted)}
              className={consentGranted ? 'btn-secondary' : 'btn-primary'}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>{consentGranted ? 'Revoke Consent' : 'Grant Consent'}</span>
              )}
            </button>
          </div>
          
          {consentGranted && (
            <div className="mt-4 bg-warm-sand/20 rounded-lg p-4">
              <p className="text-warm-primary text-body-sm">
                <strong>Note:</strong> Revoking consent will deactivate all your voice profiles 
                but will not delete existing voice memories. You can re-grant consent at any time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
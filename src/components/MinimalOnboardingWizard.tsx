
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, ChevronRight, Key, Globe, Youtube, Database, ArrowLeft } from 'lucide-react'

interface MinimalOnboardingWizardProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export default function MinimalOnboardingWizard({ isOpen, onClose, onComplete }: MinimalOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [apiKey, setApiKey] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [selectedDatasource, setSelectedDatasource] = useState('')

  const mockDatasources = [
    { id: '1', name: 'Company Knowledge Base', type: 'document' },
    { id: '2', name: 'Product Documentation', type: 'web' },
    { id: '3', name: 'Support Articles', type: 'document' }
  ]

  if (!isOpen) return null

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return apiKey.trim().length > 0
      case 2:
        return websiteUrl.trim().length > 0 || youtubeUrl.trim().length > 0
      case 3:
        return true // Optional step
      default:
        return false
    }
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-lg border-0 rounded-2xl">
        <CardHeader className="pb-4 pt-6 px-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Quick Setup
            </CardTitle>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {currentStep}/3
            </span>
          </div>
          
          <div className="flex space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  step <= currentStep ? 'bg-indigo-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <Key className="h-4 w-4 text-indigo-500" />
                <h3 className="font-medium text-gray-900">API Configuration</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key" className="text-sm text-gray-700">
                  Enter your API key
                </Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <Globe className="h-4 w-4 text-indigo-500" />
                <h3 className="font-medium text-gray-900">Content Sources</h3>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="website-url" className="text-sm text-gray-700">
                    Website URL (optional)
                  </Label>
                  <Input
                    id="website-url"
                    type="url"
                    placeholder="https://example.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube-url" className="text-sm text-gray-700">
                    YouTube URL (optional)
                  </Label>
                  <div className="relative">
                    <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="youtube-url"
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className="w-full pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <Database className="h-4 w-4 text-indigo-500" />
                <h3 className="font-medium text-gray-900">Data Sources</h3>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-700">
                  Select an existing data source (optional)
                </Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {mockDatasources.map((datasource) => (
                    <div
                      key={datasource.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedDatasource === datasource.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedDatasource(
                        selectedDatasource === datasource.id ? '' : datasource.id
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          {datasource.name}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {datasource.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <div className="flex space-x-2">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBack}
                  className="flex items-center space-x-1"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Back</span>
                </Button>
              )}
            </div>
            
            <div className="flex space-x-2">
              {currentStep === 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-gray-600"
                >
                  I'll do this later
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center space-x-1"
              >
                <span>{currentStep === 3 ? 'Complete' : 'Continue'}</span>
                {currentStep < 3 && <ChevronRight className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, ChevronRight, ArrowLeft } from 'lucide-react'

interface MinimalOnboardingWizardProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

interface DataSource {
  id: string
  name: string
  type: 'document' | 'web' | 'youtube' | 'api' | 'database'
  description: string
  fields: Array<{
    key: string
    label: string
    type: 'text' | 'url' | 'password' | 'textarea'
    placeholder: string
    required?: boolean
  }>
}

const availableDataSources: DataSource[] = [
  {
    id: 'website',
    name: 'Website Scraper',
    type: 'web',
    description: 'Extract content from websites',
    fields: [
      { key: 'url', label: 'Website URL', type: 'url', placeholder: 'https://example.com', required: true },
      { key: 'depth', label: 'Crawl Depth', type: 'text', placeholder: '2' }
    ]
  },
  {
    id: 'youtube',
    name: 'YouTube Videos',
    type: 'youtube',
    description: 'Extract transcripts from YouTube videos',
    fields: [
      { key: 'url', label: 'YouTube URL', type: 'url', placeholder: 'https://youtube.com/watch?v=...', required: true }
    ]
  },
  {
    id: 'documents',
    name: 'Document Upload',
    type: 'document',
    description: 'Upload PDF, DOCX, or TXT files',
    fields: [
      { key: 'name', label: 'Collection Name', type: 'text', placeholder: 'My Documents', required: true }
    ]
  },
  {
    id: 'api',
    name: 'API Endpoint',
    type: 'api',
    description: 'Connect to REST API endpoints',
    fields: [
      { key: 'endpoint', label: 'API Endpoint', type: 'url', placeholder: 'https://api.example.com/data', required: true },
      { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'Your API key' },
      { key: 'headers', label: 'Custom Headers', type: 'textarea', placeholder: 'Authorization: Bearer token' }
    ]
  }
]

export default function MinimalOnboardingWizard({ isOpen, onClose, onComplete }: MinimalOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [apiKey, setApiKey] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [selectedDataSource, setSelectedDataSource] = useState<string>('')
  const [dataSourceDetails, setDataSourceDetails] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const handleNext = () => {
    if (currentStep < 4) {
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
        return selectedDataSource.length > 0 || true // Allow skipping
      case 4:
        const selectedSource = availableDataSources.find(ds => ds.id === selectedDataSource)
        if (!selectedSource) return true
        return selectedSource.fields.filter(f => f.required).every(field => 
          dataSourceDetails[field.key]?.trim().length > 0
        )
      default:
        return false
    }
  }

  const getSelectedDataSource = () => {
    return availableDataSources.find(ds => ds.id === selectedDataSource)
  }

  const updateDataSourceDetail = (key: string, value: string) => {
    setDataSourceDetails(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl border-0 rounded-2xl">
        <CardHeader className="pb-4 pt-6 px-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="text-center">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              Quick Setup
            </CardTitle>
            <p className="text-sm text-gray-500">
              Step {currentStep} of 4
            </p>
          </div>
          
          <div className="flex space-x-1 mt-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  step <= currentStep 
                    ? 'bg-primary' 
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="font-medium text-gray-900 mb-1">API Key</h3>
                <p className="text-sm text-gray-500">Enter your API key to get started</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key" className="text-sm font-medium">
                  API Key
                </Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="font-medium text-gray-900 mb-1">Add Content</h3>
                <p className="text-sm text-gray-500">Add some initial content sources</p>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="website-url" className="text-sm font-medium">
                    Website URL
                  </Label>
                  <Input
                    id="website-url"
                    type="url"
                    placeholder="https://example.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube-url" className="text-sm font-medium">
                    YouTube URL
                  </Label>
                  <Input
                    id="youtube-url"
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="font-medium text-gray-900 mb-1">Data Source</h3>
                <p className="text-sm text-gray-500">Choose a data source type</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Select Data Source
                </Label>
                <Select value={selectedDataSource} onValueChange={setSelectedDataSource}>
                  <SelectTrigger className="h-10 w-full bg-white border border-gray-300 text-gray-900 hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Choose a data source..." className="text-gray-500" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                    {availableDataSources.map((source) => (
                      <SelectItem 
                        key={source.id} 
                        value={source.id} 
                        className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50 text-gray-900 px-3 py-2"
                      >
                        <div>
                          <div className="font-medium">{source.name}</div>
                          <div className="text-xs text-gray-500">{source.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              {getSelectedDataSource() ? (
                <>
                  <div className="text-center mb-4">
                    <h3 className="font-medium text-gray-900 mb-1">Configure {getSelectedDataSource()!.name}</h3>
                    <p className="text-sm text-gray-500">{getSelectedDataSource()!.description}</p>
                  </div>
                  <div className="space-y-3">
                    {getSelectedDataSource()!.fields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key} className="text-sm font-medium">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        {field.type === 'textarea' ? (
                          <textarea
                            id={field.key}
                            placeholder={field.placeholder}
                            value={dataSourceDetails[field.key] || ''}
                            onChange={(e) => updateDataSourceDetail(field.key, e.target.value)}
                            className="w-full min-h-[60px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
                            rows={2}
                          />
                        ) : (
                          <Input
                            id={field.key}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={dataSourceDetails[field.key] || ''}
                            onChange={(e) => updateDataSourceDetail(field.key, e.target.value)}
                            className="h-10"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <h3 className="font-medium text-gray-900 mb-1">All Set!</h3>
                  <p className="text-sm text-gray-500">You can add data sources later</p>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            {currentStep > 1 ? (
              <Button
                variant="ghost"
                onClick={handleBack}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            ) : <div />}
            
            <div className="flex space-x-2">
              {(currentStep === 3 || currentStep === 4) && (
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Skip
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center space-x-1"
              >
                <span>{currentStep === 4 ? 'Complete' : 'Continue'}</span>
                {currentStep < 4 && <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

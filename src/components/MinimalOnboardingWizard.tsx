
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, ChevronRight, Key, Globe, Database, ArrowLeft, FileText, Video, Link, Upload } from 'lucide-react'

interface MinimalOnboardingWizardProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

interface DataSource {
  id: string
  name: string
  type: 'document' | 'web' | 'youtube' | 'api' | 'database'
  icon: React.ElementType
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
    icon: Globe,
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
    icon: Video,
    description: 'Extract transcripts from YouTube videos',
    fields: [
      { key: 'url', label: 'YouTube URL', type: 'url', placeholder: 'https://youtube.com/watch?v=...', required: true }
    ]
  },
  {
    id: 'documents',
    name: 'Document Upload',
    type: 'document',
    icon: FileText,
    description: 'Upload PDF, DOCX, or TXT files',
    fields: [
      { key: 'name', label: 'Collection Name', type: 'text', placeholder: 'My Documents', required: true }
    ]
  },
  {
    id: 'api',
    name: 'API Endpoint',
    type: 'api',
    icon: Link,
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

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'API Configuration'
      case 2: return 'Basic Content Sources'
      case 3: return 'Choose Data Source'
      case 4: return 'Configure Data Source'
      default: return 'Setup'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white/98 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
        <CardHeader className="pb-6 pt-8 px-8 relative bg-gradient-to-r from-indigo-50 to-purple-50">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-white/50"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-xl font-bold text-gray-900">
              {getStepTitle()}
            </CardTitle>
            <span className="text-sm text-gray-500 bg-white/60 px-3 py-1.5 rounded-full font-medium">
              {currentStep}/4
            </span>
          </div>
          
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  step <= currentStep 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Key className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Enter your API key</h3>
                  <p className="text-sm text-gray-500">This will be used to process your requests</p>
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="api-key" className="text-sm font-medium text-gray-700">
                  API Key
                </Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Globe className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Add content sources</h3>
                  <p className="text-sm text-gray-500">Start with some basic content (optional)</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website-url" className="text-sm font-medium text-gray-700">
                    Website URL
                  </Label>
                  <Input
                    id="website-url"
                    type="url"
                    placeholder="https://example.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube-url" className="text-sm font-medium text-gray-700">
                    YouTube URL
                  </Label>
                  <div className="relative">
                    <Video className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="youtube-url"
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className="w-full h-12 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Database className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Choose a data source</h3>
                  <p className="text-sm text-gray-500">Select how you want to add more content</p>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Data Source Type
                </Label>
                <Select value={selectedDataSource} onValueChange={setSelectedDataSource}>
                  <SelectTrigger className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500">
                    <SelectValue placeholder="Select a data source..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-gray-200 rounded-xl shadow-lg">
                    {availableDataSources.map((source) => {
                      const IconComponent = source.icon
                      return (
                        <SelectItem 
                          key={source.id} 
                          value={source.id}
                          className="p-3 cursor-pointer hover:bg-gray-50 rounded-lg margin-1"
                        >
                          <div className="flex items-center space-x-3">
                            <IconComponent className="h-5 w-5 text-indigo-600" />
                            <div>
                              <div className="font-medium text-gray-900">{source.name}</div>
                              <div className="text-sm text-gray-500">{source.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              {getSelectedDataSource() ? (
                <>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      {React.createElement(getSelectedDataSource()!.icon, { className: "h-5 w-5 text-indigo-600" })}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Configure {getSelectedDataSource()!.name}</h3>
                      <p className="text-sm text-gray-500">{getSelectedDataSource()!.description}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {getSelectedDataSource()!.fields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key} className="text-sm font-medium text-gray-700">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        {field.type === 'textarea' ? (
                          <textarea
                            id={field.key}
                            placeholder={field.placeholder}
                            value={dataSourceDetails[field.key] || ''}
                            onChange={(e) => updateDataSourceDetail(field.key, e.target.value)}
                            className="w-full min-h-[80px] px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 resize-none"
                            rows={3}
                          />
                        ) : (
                          <Input
                            id={field.key}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={dataSourceDetails[field.key] || ''}
                            onChange={(e) => updateDataSourceDetail(field.key, e.target.value)}
                            className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">No data source selected</h3>
                  <p className="text-sm text-gray-500">You can skip this step and add data sources later</p>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <div>
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleBack}
                  className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-200 hover:border-gray-300 rounded-xl"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
              )}
            </div>
            
            <div className="flex space-x-3">
              {(currentStep === 3 || currentStep === 4) && (
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleSkip}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 rounded-xl"
                >
                  I'll do this later
                </Button>
              )}
              <Button
                size="lg"
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{currentStep === 4 ? 'Complete Setup' : 'Continue'}</span>
                {currentStep < 4 && <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

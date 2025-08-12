
import { Globe, Youtube, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface WebsiteUrlStepProps {
  websiteUrl: string
  youtubeUrl: string
  onChange: (data: { websiteUrl?: string; youtubeUrl?: string }) => void
}

export default function WebsiteUrlStep({ websiteUrl, youtubeUrl, onChange }: WebsiteUrlStepProps) {
  const handleWebsiteChange = (value: string) => {
    onChange({ websiteUrl: value })
  }

  const handleYoutubeChange = (value: string) => {
    onChange({ youtubeUrl: value })
  }

  const validateUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const testConnection = (url: string, type: 'website' | 'youtube') => {
    if (!url || !validateUrl(url)) return
    
    console.log(`Testing ${type} connection to:`, url)
    // Here you would implement actual connection testing
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
          <Globe className="h-8 w-8 text-green-600" />
        </div>
        <p className="text-gray-600">
          Connect your website and YouTube channel to start analyzing your content. 
          You can add at least one source to continue.
        </p>
      </div>

      <div className="space-y-6">
        {/* Website URL */}
        <div className="space-y-3">
          <Label htmlFor="website-url" className="text-sm font-semibold text-gray-700 flex items-center">
            <Globe className="h-4 w-4 mr-2 text-green-600" />
            Website URL
          </Label>
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="website-url"
                type="url"
                placeholder="https://yourwebsite.com"
                value={websiteUrl}
                onChange={(e) => handleWebsiteChange(e.target.value)}
                className="h-12 text-sm border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-xl bg-gray-50 focus:bg-white transition-all"
              />
            </div>
            {websiteUrl && validateUrl(websiteUrl) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => testConnection(websiteUrl, 'website')}
                className="text-green-600 border-green-200 hover:bg-green-50"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Test Connection
              </Button>
            )}
          </div>
        </div>

        {/* YouTube URL */}
        <div className="space-y-3">
          <Label htmlFor="youtube-url" className="text-sm font-semibold text-gray-700 flex items-center">
            <Youtube className="h-4 w-4 mr-2 text-red-600" />
            YouTube Channel URL
          </Label>
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="youtube-url"
                type="url"
                placeholder="https://youtube.com/@yourchannel"
                value={youtubeUrl}
                onChange={(e) => handleYoutubeChange(e.target.value)}
                className="h-12 text-sm border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-xl bg-gray-50 focus:bg-white transition-all"
              />
            </div>
            {youtubeUrl && validateUrl(youtubeUrl) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => testConnection(youtubeUrl, 'youtube')}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Test Connection
              </Button>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-900 mb-2">What we'll analyze:</h4>
          <ul className="text-amber-700 text-sm space-y-1">
            <li>• Website content and structure</li>
            <li>• YouTube video transcripts and metadata</li>
            <li>• Engagement patterns and performance metrics</li>
            <li>• Content gaps and optimization opportunities</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

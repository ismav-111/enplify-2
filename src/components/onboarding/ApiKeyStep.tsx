
import { useState } from "react"
import { Key, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface ApiKeyStepProps {
  value: string
  onChange: (value: string) => void
}

export default function ApiKeyStep({ value, onChange }: ApiKeyStepProps) {
  const [showKey, setShowKey] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const handleValidate = async () => {
    if (!value) return
    
    setIsValidating(true)
    // Simulate API validation
    setTimeout(() => {
      setIsValid(value.length >= 20) // Simple validation
      setIsValidating(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
          <Key className="h-8 w-8 text-indigo-600" />
        </div>
        <p className="text-gray-600">
          Enter your API key to connect Enplify.ai with your preferred AI service. 
          This key will be securely stored and encrypted.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key" className="text-sm font-semibold text-gray-700">
            API Key *
          </Label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="api-key"
              type={showKey ? "text" : "password"}
              placeholder="sk-..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="pl-10 pr-12 h-12 text-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50 focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {isValid === false && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Invalid API key format. Please check and try again.</span>
            </div>
          )}
          {isValid === true && (
            <div className="flex items-center space-x-2 text-green-600 text-sm">
              <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
              <span>API key validated successfully!</span>
            </div>
          )}
        </div>

        <Button
          onClick={handleValidate}
          disabled={!value || isValidating}
          variant="outline"
          className="w-full"
        >
          {isValidating ? "Validating..." : "Validate API Key"}
        </Button>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Need an API key?</h4>
          <p className="text-blue-700 text-sm">
            You can get your API key from OpenAI, Anthropic, or other supported providers. 
            Visit their respective platforms to generate a new API key.
          </p>
        </div>
      </div>
    </div>
  )
}

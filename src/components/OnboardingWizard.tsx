
import { useState } from "react"
import { X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import ApiKeyStep from "./onboarding/ApiKeyStep"
import WebsiteUrlStep from "./onboarding/WebsiteUrlStep"
import DataSourceStep from "./onboarding/DataSourceStep"

interface OnboardingWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
}

const steps = [
  { id: 1, title: "API Configuration", description: "Set up your API key" },
  { id: 2, title: "Website & YouTube", description: "Configure your URLs" },
  { id: 3, title: "Data Sources", description: "Select your data source group" },
]

export default function OnboardingWizard({ open, onOpenChange, onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [stepData, setStepData] = useState({
    apiKey: "",
    websiteUrl: "",
    youtubeUrl: "",
    dataSourceGroup: "",
  })

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    console.log("Onboarding completed with data:", stepData)
    onComplete()
    onOpenChange(false)
  }

  const handleSkip = () => {
    console.log("Onboarding skipped")
    onComplete()
    onOpenChange(false)
  }

  const updateStepData = (data: Partial<typeof stepData>) => {
    setStepData(prev => ({ ...prev, ...data }))
  }

  const currentStepData = steps[currentStep - 1]
  const progress = (currentStep / steps.length) * 100

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ApiKeyStep
            value={stepData.apiKey}
            onChange={(apiKey) => updateStepData({ apiKey })}
          />
        )
      case 2:
        return (
          <WebsiteUrlStep
            websiteUrl={stepData.websiteUrl}
            youtubeUrl={stepData.youtubeUrl}
            onChange={(data) => updateStepData(data)}
          />
        )
      case 3:
        return (
          <DataSourceStep
            value={stepData.dataSourceGroup}
            onChange={(dataSourceGroup) => updateStepData({ dataSourceGroup })}
          />
        )
      default:
        return null
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return stepData.apiKey.length > 0
      case 2:
        return stepData.websiteUrl.length > 0 || stepData.youtubeUrl.length > 0
      case 3:
        return stepData.dataSourceGroup.length > 0
      default:
        return false
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" hideCloseButton>
        <DialogHeader className="relative">
          <button
            onClick={handleSkip}
            className="absolute right-0 top-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to Enplify.ai!
          </DialogTitle>
          <p className="text-center text-gray-600 mt-2">
            Let's get you set up in just a few simple steps
          </p>
        </DialogHeader>

        <div className="space-y-6 p-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {currentStep} of {steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Header */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900">
              {currentStepData.title}
            </h3>
            <p className="text-gray-600 mt-1">
              {currentStepData.description}
            </p>
          </div>

          {/* Step Content */}
          <div className="min-h-[300px]">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleSkip}
                className="text-gray-600 hover:text-gray-800"
              >
                Skip for now
              </Button>
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-gray-500 hover:text-gray-700"
              >
                I'll do this later
              </Button>
            </div>

            <div className="flex space-x-3">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                >
                  Previous
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6"
              >
                {currentStep === steps.length ? "Complete Setup" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

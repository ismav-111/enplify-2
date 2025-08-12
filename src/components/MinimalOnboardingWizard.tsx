
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OnboardingData {
  apiKey: string;
  websiteUrl: string;
  youtubeUrl: string;
  dataSource: string;
}

interface MinimalOnboardingWizardProps {
  isOpen: boolean;
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
  onClose: () => void;
}

const MinimalOnboardingWizard: React.FC<MinimalOnboardingWizardProps> = ({
  isOpen,
  onComplete,
  onSkip,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    apiKey: '',
    websiteUrl: '',
    youtubeUrl: '',
    dataSource: ''
  });

  const totalSteps = 3;

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.apiKey.trim() !== '';
      case 2:
        return data.websiteUrl.trim() !== '' || data.youtubeUrl.trim() !== '';
      case 3:
        return true; // Data source is optional
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="apiKey" className="text-sm font-medium text-gray-700">
                API Key
              </Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={data.apiKey}
                onChange={(e) => setData({ ...data, apiKey: e.target.value })}
                className="mt-1 h-9"
              />
              <p className="text-xs text-gray-500 mt-1">This will be used to connect to AI services</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="websiteUrl" className="text-sm font-medium text-gray-700">
                Website URL
              </Label>
              <Input
                id="websiteUrl"
                type="url"
                placeholder="https://example.com"
                value={data.websiteUrl}
                onChange={(e) => setData({ ...data, websiteUrl: e.target.value })}
                className="mt-1 h-9"
              />
            </div>
            <div>
              <Label htmlFor="youtubeUrl" className="text-sm font-medium text-gray-700">
                YouTube URL
              </Label>
              <Input
                id="youtubeUrl"
                type="url"
                placeholder="https://youtube.com/channel/..."
                value={data.youtubeUrl}
                onChange={(e) => setData({ ...data, youtubeUrl: e.target.value })}
                className="mt-1 h-9"
              />
            </div>
            <p className="text-xs text-gray-500">Add at least one URL to continue</p>
          </div>
        );

      case 3:
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Data Source (Optional)
              </Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Documents', 'Spreadsheets', 'Web Content', 'Knowledge Base'].map((source) => (
                  <Badge
                    key={source}
                    variant={data.dataSource === source ? "default" : "outline"}
                    className={`cursor-pointer text-xs px-2 py-1 ${
                      data.dataSource === source 
                        ? 'bg-[#4E50A8] text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setData({ ...data, dataSource: source })}
                  >
                    {source}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Select your primary data source type</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Quick Setup
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-gray-600"
              onClick={onClose}
            >
              <X size={16} />
            </Button>
          </div>
          <div className="flex space-x-1 mt-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full ${
                  index + 1 <= currentStep ? 'bg-[#4E50A8]' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Step {currentStep} of {totalSteps}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {renderStep()}

          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBack}
                  className="h-8 px-3"
                >
                  <ChevronLeft size={14} className="mr-1" />
                  Back
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="h-8 px-3 text-gray-500 hover:text-gray-700"
              >
                I'll do this later
              </Button>
              <Button
                size="sm"
                onClick={handleNext}
                disabled={!canProceed()}
                className="h-8 px-3 bg-[#4E50A8] hover:bg-[#4E50A8]/90"
              >
                {currentStep === totalSteps ? 'Complete' : 'Next'}
                {currentStep < totalSteps && <ChevronRight size={14} className="ml-1" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MinimalOnboardingWizard;

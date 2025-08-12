
import { useState } from "react"
import { Database, Check, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DataSourceStepProps {
  value: string
  onChange: (value: string) => void
}

const dataSourceGroups = [
  {
    id: "content-analysis",
    name: "Content Analysis",
    description: "Analyze website content, blog posts, and marketing materials",
    features: ["SEO optimization", "Content gaps", "Readability analysis"],
    recommended: true,
  },
  {
    id: "video-insights",
    name: "Video Insights",
    description: "Deep analysis of YouTube videos and engagement metrics",
    features: ["Transcript analysis", "Engagement tracking", "Trend identification"],
    recommended: false,
  },
  {
    id: "comprehensive",
    name: "Comprehensive Suite",
    description: "Full analysis across all content types and platforms",
    features: ["All content analysis", "Cross-platform insights", "Advanced reporting"],
    recommended: false,
  },
  {
    id: "custom",
    name: "Custom Configuration",
    description: "Set up your own data source configuration",
    features: ["Flexible setup", "Custom integrations", "Advanced controls"],
    recommended: false,
  },
]

export default function DataSourceStep({ value, onChange }: DataSourceStepProps) {
  const [selectedGroup, setSelectedGroup] = useState(value)

  const handleSelect = (groupId: string) => {
    setSelectedGroup(groupId)
    onChange(groupId)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
          <Database className="h-8 w-8 text-purple-600" />
        </div>
        <p className="text-gray-600">
          Choose the data source group that best fits your needs. 
          You can always modify this later in your settings.
        </p>
      </div>

      <div className="space-y-3">
        {dataSourceGroups.map((group) => (
          <div
            key={group.id}
            className={`relative border rounded-xl p-4 cursor-pointer transition-all ${
              selectedGroup === group.id
                ? "border-purple-500 bg-purple-50 shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => handleSelect(group.id)}
          >
            {group.recommended && (
              <div className="absolute -top-2 left-4 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold rounded-full">
                Recommended
              </div>
            )}
            
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                    selectedGroup === group.id
                      ? "border-purple-500 bg-purple-500"
                      : "border-gray-300"
                  }`}>
                    {selectedGroup === group.id && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900">{group.name}</h3>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 ml-8">
                  {group.description}
                </p>
                
                <div className="ml-8">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Includes:</h4>
                  <ul className="space-y-1">
                    {group.features.map((feature, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-center">
                        <ChevronRight className="h-3 w-3 mr-1 text-gray-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedGroup && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2">Ready to proceed!</h4>
          <p className="text-green-700 text-sm">
            You've selected the{" "}
            <span className="font-semibold">
              {dataSourceGroups.find(g => g.id === selectedGroup)?.name}
            </span>{" "}
            configuration. Click "Complete Setup" to finish your onboarding.
          </p>
        </div>
      )}
    </div>
  )
}

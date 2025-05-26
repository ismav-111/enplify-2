
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

type FormData = z.infer<typeof formSchema>

export default function Auth() {
  const [isSignIn, setIsSignIn] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(data: FormData) {
    setIsLoading(true)
    console.log(data)
    
    setTimeout(() => {
      setIsLoading(false)
      navigate("/")
    }, 1000)
  }

  const features = [
    { icon: "💬", title: "Intuitive Chat Interface" },
    { icon: "☁️", title: "Smart Document Handling" },
    { icon: "⚙️", title: "Seamless Integrations" },
    { icon: "💬", title: "Omni-Channel Support" },
    { icon: "📊", title: "Configurable Framework" },
    { icon: "🔒", title: "Secure & Personalized" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Brand and Features */}
      <div className="flex-1 flex flex-col justify-center px-16 py-16">
        <div className="max-w-2xl">
          <h1 className="text-6xl font-bold text-indigo-600 mb-12 font-comfortaa leading-tight">
            enplify<span className="text-indigo-400">.ai</span>
          </h1>
          
          <p className="text-2xl text-gray-800 leading-relaxed mb-16 font-medium max-w-xl">
            Experience seamless enterprise information integration and achieve unparalleled user experience with our innovative Gen AI solution
          </p>
          
          <div className="grid grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-4">
                <span className="text-3xl flex-shrink-0">{feature.icon}</span>
                <span className="text-gray-800 font-semibold text-lg leading-6">{feature.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right Side - Authentication Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md bg-white shadow-xl border-0 rounded-2xl">
          <CardHeader className="pb-8 pt-12 px-12 text-left">
            <CardTitle className="text-2xl font-semibold text-gray-900 mb-4">
              {isSignIn ? "Sign In" : "Sign Up"}
            </CardTitle>
            <p className="text-gray-600 text-sm">
              {isSignIn ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignIn(false)}
                    className="text-indigo-600 font-medium hover:text-indigo-500 transition-colors"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignIn(true)}
                    className="text-indigo-600 font-medium hover:text-indigo-500 transition-colors"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </CardHeader>

          <CardContent className="px-12 pb-12">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full h-11 pl-10 pr-4 text-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                    {...form.register("email")}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-xs text-red-600">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  {isSignIn && (
                    <button
                      type="button"
                      className="text-xs text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full h-11 pl-10 pr-10 text-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-xs text-red-600">{form.formState.errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11 font-medium text-sm rounded-lg transition-colors mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : (isSignIn ? "Sign In" : "Sign Up")}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-3 h-11 border-gray-200 hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <rect width="24" height="24" fill="#f35325"/>
                  <rect y="12" width="12" height="12" fill="#81bc06"/>
                  <rect x="12" width="12" height="12" fill="#05a6f0"/>
                  <rect x="12" y="12" width="12" height="12" fill="#ffba08"/>
                </svg>
                <span className="text-gray-700">Sign in with Microsoft</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-3 h-11 border-gray-200 hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-gray-700">Sign in with Google</span>
              </Button>
            </div>

            {!isSignIn && (
              <div className="text-center pt-6">
                <button
                  type="button"
                  className="text-indigo-600 text-sm hover:text-indigo-500 font-medium transition-colors"
                  onClick={() => setIsSignIn(true)}
                >
                  Go back
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

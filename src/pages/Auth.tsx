import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Lock, Mail, MessageCircle, FileText, Zap, Headphones, Settings, Shield } from "lucide-react"
import ForgotPasswordDialog from "@/components/ForgotPasswordDialog"

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
  const [showForgotPassword, setShowForgotPassword] = useState(false)
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
    {
      title: "Intuitive Chat Interface",
      icon: MessageCircle
    },
    {
      title: "Smart Document Handling",
      icon: FileText
    },
    {
      title: "Seamless Integrations",
      icon: Zap
    },
    {
      title: "Omni-Channel Support",
      icon: Headphones
    },
    {
      title: "Configurable Framework",
      icon: Settings
    },
    {
      title: "Secure & Personalized",
      icon: Shield
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Left Side - Brand and Features */}
      <div className="flex-1 flex flex-col justify-center px-20 py-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700">
        <div className="max-w-2xl">
          <div className="mb-12">
            <h1 className="text-7xl font-bold text-white mb-8 font-comfortaa leading-tight">
              enplify<span className="text-white">.ai</span>
            </h1>
            <div className="w-24 h-1 bg-blue-200 rounded-full mb-12"></div>
            
            <p className="text-xl text-blue-100 leading-relaxed font-light mb-12">
              Experience seamless enterprise information integration and achieve unparalleled user experience with our innovative Gen AI solution
            </p>
          </div>
          
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-4 group">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-200/20 rounded-lg flex items-center justify-center group-hover:bg-blue-200/30 transition-all duration-300">
                  <feature.icon className="w-5 h-5 text-blue-200" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">{feature.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right Side - Authentication Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <Card className="w-full max-w-md bg-white shadow-2xl border-0 rounded-3xl overflow-hidden">
          <CardHeader className="pb-6 pt-12 px-12 text-left">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              {isSignIn ? "Sign In" : "Sign Up"}
            </CardTitle>
            <p className="text-gray-600 text-sm leading-relaxed">
              {isSignIn ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignIn(false)}
                    className="text-indigo-600 font-semibold hover:text-indigo-500 transition-colors underline-offset-2 hover:underline"
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
                    className="text-indigo-600 font-semibold hover:text-indigo-500 transition-colors underline-offset-2 hover:underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </CardHeader>

          <CardContent className="px-12 pb-12">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full h-12 pl-12 pr-4 text-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50 focus:bg-white transition-all"
                    {...form.register("email")}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-xs text-red-500 mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full h-12 pl-12 pr-12 text-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50 focus:bg-white transition-all"
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-xs text-red-500 mt-1">{form.formState.errors.password.message}</p>
                )}
                {isSignIn && (
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-xs text-indigo-600 hover:text-indigo-500 font-semibold transition-colors underline-offset-2 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-12 font-semibold text-sm rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mt-8"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : (isSignIn ? "Sign In" : "Sign Up")}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white text-gray-500 font-medium uppercase tracking-wider">OR</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-3 h-12 border-gray-200 hover:bg-gray-50 rounded-xl font-semibold transition-all text-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z"/>
                  <path fill="#81bc06" d="M12 1h10v10H12z"/>
                  <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                  <path fill="#ffba08" d="M12 12h10v10H12z"/>
                </svg>
                <span className="text-gray-700">Continue with Microsoft</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-3 h-12 border-gray-200 hover:bg-gray-50 rounded-xl font-semibold transition-all text-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-gray-700">Continue with Google</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ForgotPasswordDialog 
        open={showForgotPassword} 
        onOpenChange={setShowForgotPassword} 
      />
    </div>
  )
}

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex">
      {/* Left Side - Brand */}
      <div className="flex-1 flex flex-col justify-center items-center px-12 py-12 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Enhanced background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="max-w-xl relative z-10 text-center">
          {/* Typography-focused Brand */}
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-white font-comfortaa leading-tight tracking-tight mb-4">
              enplify<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">.ai</span>
            </h1>
            
            <div className="flex items-center justify-center mb-6">
              <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-3"></div>
              <span className="text-blue-200 text-sm font-medium tracking-wider">A generative AI solution from Quadrant</span>
              <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full ml-3"></div>
            </div>
            
            <p className="text-lg text-blue-100 leading-relaxed font-light max-w-lg mx-auto mb-8">
              Transform your enterprise with intelligent AI solutions that deliver exceptional user experiences.
            </p>
          </div>
          
          {/* Key Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-left">
              <h3 className="text-white font-semibold text-sm mb-1">Intuitive Chat Interface</h3>
              <p className="text-blue-200/70 text-xs">Natural conversations</p>
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold text-sm mb-1">Smart Document Handling</h3>
              <p className="text-blue-200/70 text-xs">Intelligent processing</p>
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold text-sm mb-1">Seamless Integrations</h3>
              <p className="text-blue-200/70 text-xs">Connect everything</p>
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold text-sm mb-1">Omni-Channel Support</h3>
              <p className="text-blue-200/70 text-xs">Multi-platform ready</p>
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold text-sm mb-1">Configurable Framework</h3>
              <p className="text-blue-200/70 text-xs">Tailored solutions</p>
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold text-sm mb-1">Secure & Personalized</h3>
              <p className="text-blue-200/70 text-xs">Protected experiences</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Authentication Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative min-w-0">
        {/* Subtle aura glow on the right side */}
        <div className="absolute inset-0 bg-gradient-to-l from-purple-50/50 to-transparent"></div>
        
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden relative z-10 transition-shadow duration-300 hover:shadow-3xl">
          <CardHeader className="pb-6 pt-12 px-12 text-left">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {isSignIn ? "Welcome Back" : "Get Started"}
            </CardTitle>
            <p className="text-gray-600 text-sm leading-relaxed">
              {isSignIn ? (
                <>
                  New to enplify.ai?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignIn(false)}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all underline-offset-2 hover:underline"
                  >
                    Create account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignIn(true)}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all underline-offset-2 hover:underline"
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
                    className="w-full h-12 pl-12 pr-4 text-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50 focus:bg-white transition-all hover:bg-white"
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
                    className="w-full h-12 pl-12 pr-12 text-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50 focus:bg-white transition-all hover:bg-white"
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
                      className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 font-semibold transition-all underline-offset-2 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 font-semibold text-sm rounded-xl mt-8"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : (isSignIn ? "Sign In" : "Create Account")}
              </Button>
            </form>

            <div className="relative my-6">
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
                className="w-full flex items-center justify-center gap-3 h-12 border-gray-200 hover:bg-gray-50 hover:border-indigo-200 rounded-xl font-semibold transition-all text-sm"
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

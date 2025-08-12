import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import ForgotPasswordDialog from "@/components/ForgotPasswordDialog"
import OnboardingWizard from "@/components/OnboardingWizard"
import { useOnboarding } from "@/hooks/useOnboarding"

const signInSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

const signUpSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignInFormData = z.infer<typeof signInSchema>
type SignUpFormData = z.infer<typeof signUpSchema>

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  
  const { showOnboarding, setShowOnboarding, startOnboarding, completeOnboarding, hasCompletedOnboarding } = useOnboarding()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const signUpParam = searchParams.get("signup")
    if (signUpParam === "true") {
      setIsSignUp(true)
    } else {
      setIsSignUp(false)
    }
  }, [location.search])

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { toast } = useToast()

  const handleSuccessfulAuth = () => {
    console.log("Authentication successful")
    
    // If user hasn't completed onboarding, show the wizard
    if (!hasCompletedOnboarding) {
      startOnboarding()
    } else {
      // Navigate directly to main app
      navigate("/")
    }
  }

  const handleOnboardingComplete = () => {
    completeOnboarding()
    navigate("/")
  }

  const handleSignIn = (data: SignInFormData) => {
    setIsLoading(true)
    console.log("Sign in attempt:", data.email)
    
    setTimeout(() => {
      setIsLoading(false)
      handleSuccessfulAuth()
    }, 1000)
  }

  const handleSignUp = (data: SignUpFormData) => {
    setIsLoading(true)
    console.log("Sign up attempt:", data.email)
    
    setTimeout(() => {
      setIsLoading(false)
      handleSuccessfulAuth()
    }, 1000)
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md p-6 space-y-8 border-2 border-gray-200 rounded-2xl shadow-lg bg-white">
          <CardHeader className="space-y-3">
            <CardTitle className="text-3xl font-bold text-center text-gray-900">
              {isSignUp ? "Create an Account" : "Sign In"}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 text-center">
              {isSignUp
                ? "Start your journey with Enplify.ai today!"
                : "Welcome back! Sign in to continue."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {isSignUp ? (
              <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-semibold text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      className="w-full h-12 pl-12 pr-4 text-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50 focus:bg-white transition-all"
                      {...signUpForm.register("email")}
                    />
                  </div>
                  {signUpForm.formState.errors.email && (
                    <p className="text-xs text-red-500 mt-1">{signUpForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-semibold text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full h-12 pl-12 pr-12 text-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50 focus:bg-white transition-all"
                      {...signUpForm.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {signUpForm.formState.errors.password && (
                    <p className="text-xs text-red-500 mt-1">{signUpForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password" className="text-sm font-semibold text-gray-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="w-full h-12 pl-12 pr-12 text-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50 focus:bg-white transition-all"
                      {...signUpForm.register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {signUpForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">{signUpForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-12 font-semibold text-sm rounded-xl transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            ) : (
              <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
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
                      {...signInForm.register("email")}
                    />
                  </div>
                  {signInForm.formState.errors.email && (
                    <p className="text-xs text-red-500 mt-1">{signInForm.formState.errors.email.message}</p>
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
                      {...signInForm.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {signInForm.formState.errors.password && (
                    <p className="text-xs text-red-500 mt-1">{signInForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-12 font-semibold text-sm rounded-xl transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            )}

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          </CardContent>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <Link
                to={isSignUp ? "/signin" : "/signup"}
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors ml-1"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </Link>
            </p>
          </div>
        </Card>
      </div>
      
      {/* Add the onboarding wizard */}
      <OnboardingWizard
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
        onComplete={handleOnboardingComplete}
      />

      <ForgotPasswordDialog
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
      />
    </>
  )
}

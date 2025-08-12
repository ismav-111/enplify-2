import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate, useLocation } from "react-router-dom"
import { Eye, EyeOff, Lock, Mail, Building, User } from "lucide-react"
import ForgotPasswordDialog from "@/components/ForgotPasswordDialog"

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
  accountType: z.enum(["individual", "organization"]),
  organizationName: z.string().optional(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

type SignInData = z.infer<typeof signInSchema>
type SignUpData = z.infer<typeof signUpSchema>

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [detectedOrg, setDetectedOrg] = useState("")
  const [showPasswordField, setShowPasswordField] = useState(false)
  
  // Sign up specific states
  const [signUpStep, setSignUpStep] = useState(1) // 1: email, 2: verification, 3: all fields
  const [signUpEmail, setSignUpEmail] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [accountType, setAccountType] = useState<"individual" | "organization" | "">("")
  const [organizationName, setOrganizationName] = useState("")
  
  // Sign in specific states
  const [signInStep, setSignInStep] = useState(1) // 1: email, 2: password and submit
  const [signInEmail, setSignInEmail] = useState("")
  
  const navigate = useNavigate()
  const location = useLocation()
  const isSignUp = location.pathname === "/signup"
  
  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const signUpForm = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      accountType: "individual",
      organizationName: "",
      password: "",
    },
  })

  // Detect organization from email domain for sign in step 2
  React.useEffect(() => {
    if (!isSignUp && signInStep === 2 && signInEmail && signInEmail.includes("@")) {
      const domain = signInEmail.split("@")[1]
      if (domain && domain !== "gmail.com" && domain !== "yahoo.com" && domain !== "hotmail.com" && domain !== "outlook.com") {
        const orgName = domain.split(".")[0]
        setDetectedOrg(orgName.charAt(0).toUpperCase() + orgName.slice(1))
      } else {
        setDetectedOrg("")
      }
    }
  }, [signInEmail, isSignUp, signInStep])

  function handleSignInEmailSubmit() {
    if (signInEmail && signInEmail.includes("@")) {
      signInForm.setValue("email", signInEmail)
      setSignInStep(2)
    }
  }

  function onSignInSubmit(data: SignInData) {
    setIsLoading(true)
    console.log("Demo Sign In - bypassing authentication:", data)
    
    // Set flag for first-time user to trigger onboarding
    localStorage.setItem('isFirstTimeUser', 'true')
    
    setTimeout(() => {
      setIsLoading(false)
      navigate("/") // Navigate to chat interface instead of settings
    }, 1500)
  }

  function handleSignUpEmailSubmit() {
    if (signUpEmail && signUpEmail.includes("@")) {
      setIsLoading(true)
      console.log("Sending verification link to:", signUpEmail)
      
      setTimeout(() => {
        setIsLoading(false)
        setSignUpStep(2)
      }, 1000)
    }
  }

  function handleVerificationComplete() {
    setIsVerified(true)
    setSignUpStep(3)
  }

  function handleSignUpSubmit() {
    setIsLoading(true)
    const signUpData = {
      email: signUpEmail,
      accountType,
      organizationName: accountType === "organization" ? organizationName : undefined,
      password: signUpForm.getValues("password")
    }
    console.log("Demo Sign Up - bypassing authentication:", signUpData)
    
    // Set flag for first-time user to trigger onboarding
    localStorage.setItem('isFirstTimeUser', 'true')
    
    setTimeout(() => {
      setIsLoading(false)
      navigate("/") // Navigate to chat interface instead of settings
    }, 1500)
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
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="max-w-xl relative z-10 text-center">
          <div className="mb-12">
            <h1 className="product-logo text-white leading-none tracking-tight mb-8">
              enplify<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">.ai</span>
            </h1>
            
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-4"></div>
              <span className="text-blue-200 text-lg font-medium tracking-wider">A generative AI solution from Quadrant</span>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full ml-4"></div>
            </div>
            
            <p className="text-xl text-blue-100 leading-relaxed font-light max-w-lg mx-auto mb-12">
              Transform your enterprise with intelligent AI solutions that deliver exceptional user experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="text-left">
              <h3 className="text-white font-semibold text-base mb-2">Intuitive Chat Interface</h3>
              <p className="text-blue-200/70 text-sm">Natural conversations</p>
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold text-base mb-2">Smart Document Handling</h3>
              <p className="text-blue-200/70 text-sm">Intelligent processing</p>
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold text-base mb-2">Seamless Integrations</h3>
              <p className="text-blue-200/70 text-sm">Connect everything</p>
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold text-base mb-2">Omni-Channel Support</h3>
              <p className="text-blue-200/70 text-sm">Multi-platform ready</p>
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold text-base mb-2">Configurable Framework</h3>
              <p className="text-blue-200/70 text-sm">Tailored solutions</p>
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold text-base mb-2">Secure & Personalized</h3>
              <p className="text-blue-200/70 text-sm">Protected experiences</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Authentication Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative min-w-0">
        <div className="absolute inset-0 bg-gradient-to-l from-purple-50/50 to-transparent"></div>
        
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden relative z-10 transition-shadow duration-300 hover:shadow-3xl">
          <CardHeader className="pb-4 pt-12 px-12 text-left">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {isSignUp ? "Sign Up" : "Sign In"}
            </CardTitle>
          </CardHeader>

          <CardContent className="px-12 pb-12">
            {!isSignUp ? (
              // Sign In Form
              <div className="space-y-6">
                {signInStep === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-sm font-semibold text-gray-700">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="you@company.com"
                          value={signInEmail}
                          onChange={(e) => setSignInEmail(e.target.value)}
                          className="w-full h-12 pl-12 pr-4 text-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50 focus:bg-white transition-all hover:bg-white"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleSignInEmailSubmit}
                      className="w-full h-12 font-semibold text-sm rounded-xl"
                      disabled={isLoading || !signInEmail}
                    >
                      {isLoading ? "Continue..." : "Continue"}
                    </Button>
                  </div>
                )}

                {signInStep === 2 && (
                  <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="email"
                          value={signInEmail}
                          readOnly
                          className="w-full h-12 pl-12 pr-4 text-sm border-gray-200 rounded-xl bg-gray-100 text-gray-600"
                        />
                      </div>
                    </div>

                    {detectedOrg && (
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          Organization
                        </Label>
                        <div className="relative">
                          <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            type="text"
                            value={detectedOrg}
                            readOnly
                            className="w-full h-12 pl-12 pr-4 text-sm border-gray-200 rounded-xl bg-gray-100 text-gray-600"
                          />
                        </div>
                      </div>
                    )}

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

                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 font-semibold text-sm rounded-xl mt-8"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing you in..." : "Sign In"}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setSignInStep(1)}
                        className="text-sm text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
                      >
                        Back to email
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              // Sign Up Form
              <div className="space-y-6">
                {signUpStep === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm font-semibold text-gray-700">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@company.com"
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                          className="w-full h-12 pl-12 pr-4 text-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50 focus:bg-white transition-all hover:bg-white"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleSignUpEmailSubmit}
                      className="w-full h-12 font-semibold text-sm rounded-xl"
                      disabled={isLoading || !signUpEmail}
                    >
                      {isLoading ? "Sending..." : "Continue"}
                    </Button>
                  </div>
                )}

                {signUpStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-600">
                        We've sent a verification link to <span className="font-medium">{signUpEmail}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Please check your email and click the verification link to continue.
                      </p>
                    </div>
                    <Button
                      onClick={handleVerificationComplete}
                      className="w-full h-12 font-semibold text-sm rounded-xl"
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying..." : "I've verified my email"}
                    </Button>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleSignUpEmailSubmit}
                        className="text-sm text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
                      >
                        Resend verification link
                      </button>
                    </div>
                  </div>
                )}

                {signUpStep === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Account Type
                      </Label>
                      <Select value={accountType} onValueChange={(value: "individual" | "organization") => setAccountType(value)}>
                        <SelectTrigger className="w-full h-12 rounded-xl">
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              Individual
                            </div>
                          </SelectItem>
                          <SelectItem value="organization">
                            <div className="flex items-center">
                              <Building className="h-4 w-4 mr-2" />
                              Organization
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {accountType === "organization" && (
                      <div className="space-y-2">
                        <Label htmlFor="org-name" className="text-sm font-semibold text-gray-700">
                          Organization Name
                        </Label>
                        <div className="relative">
                          <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="org-name"
                            type="text"
                            placeholder="Enter organization name"
                            value={organizationName}
                            onChange={(e) => setOrganizationName(e.target.value)}
                            className="w-full h-12 pl-12 pr-4 text-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50 focus:bg-white transition-all hover:bg-white"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-sm font-semibold text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="w-full h-12 pl-12 pr-12 text-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50 focus:bg-white transition-all hover:bg-white"
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

                    <Button
                      onClick={handleSignUpSubmit}
                      className="w-full h-12 font-semibold text-sm rounded-xl"
                      disabled={isLoading || !accountType || (accountType === "organization" && !organizationName)}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Social Login Options - Show only on step 1 for both signup and signin */}
            {((!isSignUp && signInStep === 1) || (isSignUp && signUpStep === 1)) && (
              <>
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
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-3 h-12 border-gray-200 hover:bg-gray-50 hover:border-indigo-200 rounded-xl font-semibold transition-all text-sm"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#F35325" d="M1 1h10v10H1z"/>
                      <path fill="#81BC06" d="M13 1h10v10H13z"/>
                      <path fill="#05A6F0" d="M1 13h10v10H1z"/>
                      <path fill="#FFBA08" d="M13 13h10v10H13z"/>
                    </svg>
                    <span className="text-gray-700">Continue with Microsoft</span>
                  </Button>
                </div>
              </>
            )}

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
                  onClick={() => navigate(isSignUp ? "/signin" : "/signup")}
                >
                  {isSignUp ? "Sign in" : "Sign up"}
                </button>
              </p>
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

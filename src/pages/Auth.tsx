import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Lock, Mail, Building2, Users, User } from "lucide-react"
import ForgotPasswordDialog from "@/components/ForgotPasswordDialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const signInSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  organizationId: z.string().optional(),
})

const orgRegistrationSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  verificationCode: z.string().min(6, {
    message: "Verification code must be 6 digits.",
  }).optional(),
  organizationName: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }).optional(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }).optional(),
})

const userRegistrationSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

type SignInData = z.infer<typeof signInSchema>
type OrgRegistrationData = z.infer<typeof orgRegistrationSchema>
type UserRegistrationData = z.infer<typeof userRegistrationSchema>

export default function Auth() {
  const [authMode, setAuthMode] = useState<"signin" | "org-register" | "user-register">("signin")
  const [orgRegistrationStep, setOrgRegistrationStep] = useState<"email" | "verify" | "orgname" | "password">("email")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const navigate = useNavigate()
  
  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      organizationId: "",
    },
  })

  const orgRegistrationForm = useForm<OrgRegistrationData>({
    resolver: zodResolver(orgRegistrationSchema),
    defaultValues: {
      email: "",
      verificationCode: "",
      organizationName: "",
      password: "",
    },
  })

  const userRegistrationForm = useForm<UserRegistrationData>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSignInSubmit(data: SignInData) {
    setIsLoading(true)
    console.log("Sign In Data:", data)
    
    setTimeout(() => {
      setIsLoading(false)
      navigate("/")
    }, 1000)
  }

  function onOrgRegistrationSubmit(data: OrgRegistrationData) {
    setIsLoading(true)
    console.log("Organization Registration Data:", data)
    
    if (orgRegistrationStep === "email") {
      // Send verification code
      console.log("Sending verification code to:", data.email)
      setTimeout(() => {
        setIsLoading(false)
        setOrgRegistrationStep("verify")
      }, 1000)
    } else if (orgRegistrationStep === "verify") {
      // Verify code
      console.log("Verifying code:", data.verificationCode)
      setTimeout(() => {
        setIsLoading(false)
        setOrgRegistrationStep("orgname")
      }, 1000)
    } else if (orgRegistrationStep === "orgname") {
      // Set organization name
      console.log("Setting organization name:", data.organizationName)
      setTimeout(() => {
        setIsLoading(false)
        setOrgRegistrationStep("password")
      }, 1000)
    } else if (orgRegistrationStep === "password") {
      // Complete registration
      console.log("Completing organization registration")
      setTimeout(() => {
        setIsLoading(false)
        navigate("/")
      }, 1000)
    }
  }

  function onUserRegistrationSubmit(data: UserRegistrationData) {
    setIsLoading(true)
    console.log("User Registration Data:", data)
    
    setTimeout(() => {
      setIsLoading(false)
      navigate("/")
    }, 1000)
  }

  const getTitle = () => {
    if (authMode === "signin") return "Welcome Back"
    if (authMode === "org-register") {
      switch (orgRegistrationStep) {
        case "email": return "Create Organization"
        case "verify": return "Verify Email"
        case "orgname": return "Organization Details"
        case "password": return "Set Password"
        default: return "Create Organization"
      }
    }
    return "Join Team"
  }

  const getSubTitle = () => {
    if (authMode === "signin") {
      return (
        <>
          New to enplify.ai?{" "}
          <button
            type="button"
            onClick={() => setAuthMode("org-register")}
            className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all underline-offset-2 hover:underline"
          >
            Create organization
          </button>{" "}
          or{" "}
          <button
            type="button"
            onClick={() => setAuthMode("user-register")}
            className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all underline-offset-2 hover:underline"
          >
            join team
          </button>
        </>
      )
    }
    return (
      <>
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => {
            setAuthMode("signin")
            setOrgRegistrationStep("email")
          }}
          className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all underline-offset-2 hover:underline"
        >
          Sign in
        </button>
      </>
    )
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
          {/* PROMINENT BRAND LOGO */}
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
          
          {/* Key Features Grid */}
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
        {/* Subtle aura glow on the right side */}
        <div className="absolute inset-0 bg-gradient-to-l from-purple-50/50 to-transparent"></div>
        
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden relative z-10 transition-shadow duration-300 hover:shadow-3xl">
          <CardHeader className="pb-6 pt-12 px-12 text-left">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {getTitle()}
            </CardTitle>
            <p className="text-gray-600 text-sm leading-relaxed">
              {getSubTitle()}
            </p>
          </CardHeader>

          <CardContent className="px-12 pb-12">
            {/* Sign In Form */}
            {authMode === "signin" && (
              <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-6">
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
                      {...signInForm.register("email")}
                    />
                  </div>
                  {signInForm.formState.errors.email && (
                    <p className="text-xs text-red-500 mt-1">{signInForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizationId" className="text-sm font-semibold text-gray-700">
                    Organization (Optional)
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="organizationId"
                      type="text"
                      placeholder="Organization ID or name"
                      className="w-full h-12 pl-12 pr-4 text-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50 focus:bg-white transition-all hover:bg-white"
                      {...signInForm.register("organizationId")}
                    />
                  </div>
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

                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 font-semibold transition-all underline-offset-2 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 font-semibold text-sm rounded-xl mt-8"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            )}

            {/* Organization Registration Form */}
            {authMode === "org-register" && (
              <form onSubmit={orgRegistrationForm.handleSubmit(onOrgRegistrationSubmit)} className="space-y-6">
                {orgRegistrationStep === "email" && (
                  <div className="space-y-2">
                    <Label htmlFor="org-email" className="text-sm font-semibold text-gray-700">
                      Organization Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="org-email"
                        type="email"
                        placeholder="Enter organization email"
                        className="w-full h-12 pl-12 pr-4 text-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50 focus:bg-white transition-all hover:bg-white"
                        {...orgRegistrationForm.register("email")}
                      />
                    </div>
                    {orgRegistrationForm.formState.errors.email && (
                      <p className="text-xs text-red-500 mt-1">{orgRegistrationForm.formState.errors.email.message}</p>
                    )}
                  </div>
                )}

                {orgRegistrationStep === "verify" && (
                  <div className="space-y-2">
                    <Label htmlFor="verification-code" className="text-sm font-semibold text-gray-700">
                      Verification Code
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="verification-code"
                        type="text"
                        placeholder="Enter 6-digit code"
                        className="w-full h-12 pl-12 pr-4 text-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50 focus:bg-white transition-all hover:bg-white"
                        {...orgRegistrationForm.register("verificationCode")}
                      />
                    </div>
                    {orgRegistrationForm.formState.errors.verificationCode && (
                      <p className="text-xs text-red-500 mt-1">{orgRegistrationForm.formState.errors.verificationCode.message}</p>
                    )}
                  </div>
                )}

                {orgRegistrationStep === "orgname" && (
                  <div className="space-y-2">
                    <Label htmlFor="organization-name" className="text-sm font-semibold text-gray-700">
                      Organization Name
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="organization-name"
                        type="text"
                        placeholder="Enter organization name"
                        className="w-full h-12 pl-12 pr-4 text-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50 focus:bg-white transition-all hover:bg-white"
                        {...orgRegistrationForm.register("organizationName")}
                      />
                    </div>
                    {orgRegistrationForm.formState.errors.organizationName && (
                      <p className="text-xs text-red-500 mt-1">{orgRegistrationForm.formState.errors.organizationName.message}</p>
                    )}
                  </div>
                )}

                {orgRegistrationStep === "password" && (
                  <div className="space-y-2">
                    <Label htmlFor="org-password" className="text-sm font-semibold text-gray-700">
                      Set Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="org-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        className="w-full h-12 pl-12 pr-12 text-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50 focus:bg-white transition-all hover:bg-white"
                        {...orgRegistrationForm.register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {orgRegistrationForm.formState.errors.password && (
                      <p className="text-xs text-red-500 mt-1">{orgRegistrationForm.formState.errors.password.message}</p>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 font-semibold text-sm rounded-xl mt-8"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : 
                   orgRegistrationStep === "email" ? "Send Verification Code" :
                   orgRegistrationStep === "verify" ? "Verify Code" :
                   orgRegistrationStep === "orgname" ? "Continue" :
                   "Create Organization"}
                </Button>
              </form>
            )}

            {/* User Registration Form */}
            {authMode === "user-register" && (
              <form onSubmit={userRegistrationForm.handleSubmit(onUserRegistrationSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="user-email" className="text-sm font-semibold text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="user-email"
                      type="email"
                      placeholder="Enter your email"
                      className="w-full h-12 pl-12 pr-4 text-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50 focus:bg-white transition-all hover:bg-white"
                      {...userRegistrationForm.register("email")}
                    />
                  </div>
                  {userRegistrationForm.formState.errors.email && (
                    <p className="text-xs text-red-500 mt-1">{userRegistrationForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-password" className="text-sm font-semibold text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="user-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      className="w-full h-12 pl-12 pr-12 text-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50 focus:bg-white transition-all hover:bg-white"
                      {...userRegistrationForm.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {userRegistrationForm.formState.errors.password && (
                    <p className="text-xs text-red-500 mt-1">{userRegistrationForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 font-semibold text-sm rounded-xl mt-8"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Register"}
                </Button>
              </form>
            )}

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

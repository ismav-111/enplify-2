
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Lock } from "lucide-react"

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
    { icon: "📄", title: "Smart Document Handling" },
    { icon: "⚡", title: "Seamless Integrations" },
    { icon: "🔊", title: "Omni-Channel Support" },
    { icon: "⚙️", title: "Configurable Framework" },
    { icon: "🔒", title: "Secure & Personalized" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Brand and Features */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12">
        <div className="max-w-lg">
          <h1 className="text-4xl lg:text-5xl font-bold text-indigo-600 mb-6 font-comfortaa">
            enplify<span className="text-indigo-400">.ai</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-10 font-medium">
            Experience seamless enterprise information integration and achieve unparalleled user experience with our innovative Gen AI solution
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <span className="text-xl flex-shrink-0 mt-0.5">{feature.icon}</span>
                <span className="text-gray-700 font-medium text-sm leading-5">{feature.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right Side - Authentication Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center pb-8 pt-8">
            <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
              {isSignIn ? "Sign In" : "Sign Up"}
            </CardTitle>
            <p className="text-gray-600 text-sm">
              {isSignIn ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignIn(false)}
                    className="text-indigo-600 font-medium hover:text-indigo-500 underline"
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
                    className="text-indigo-600 font-medium hover:text-indigo-500 underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-12 px-4"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-600 mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full h-12 pl-10 pr-10"
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-xs text-red-600 mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 font-medium mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : (isSignIn ? "Sign In" : "Sign Up")}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">OR</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-3 h-12 border-gray-300"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium">Sign in with Google</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-3 h-12 border-gray-300"
              >
                <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none">
                  <path d="M11.5 0C5.159 0 0 5.159 0 11.5S5.159 23 11.5 23 23 17.841 23 11.5 17.841 0 11.5 0z" fill="#f25022"/>
                  <path d="M11.5 0v11.5H0C0 5.159 5.159 0 11.5 0z" fill="#7fba00"/>
                  <path d="M0 11.5h11.5V23C5.159 23 0 17.841 0 11.5z" fill="#00a4ef"/>
                  <path d="M11.5 11.5H23c0 6.341-5.159 11.5-11.5 11.5V11.5z" fill="#ffb900"/>
                </svg>
                <span className="font-medium">Sign in with Microsoft</span>
              </Button>
            </div>

            <div className="text-center pt-6">
              <button
                type="button"
                className="text-indigo-600 text-sm hover:text-indigo-500 underline"
                onClick={() => navigate("/")}
              >
                Go back to home
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

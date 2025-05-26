
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"

const emailSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

const passwordSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type EmailFormData = z.infer<typeof emailSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

interface ForgotPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ForgotPasswordDialog({ open, onOpenChange }: ForgotPasswordDialogProps) {
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const handleEmailSubmit = (data: EmailFormData) => {
    setIsLoading(true)
    console.log("Sending OTP to:", data.email)
    setEmail(data.email)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setStep('otp')
    }, 1000)
  }

  const handleOtpVerification = () => {
    if (otp.length !== 6) return
    
    setIsLoading(true)
    console.log("Verifying OTP:", otp)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setStep('password')
    }, 1000)
  }

  const handlePasswordReset = (data: PasswordFormData) => {
    setIsLoading(true)
    console.log("Resetting password for:", email)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      onOpenChange(false)
      // Reset form state
      setStep('email')
      setOtp("")
      setEmail("")
      emailForm.reset()
      passwordForm.reset()
    }, 1000)
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset form state when closing
    setStep('email')
    setOtp("")
    setEmail("")
    emailForm.reset()
    passwordForm.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {step === 'email' && 'Forgot Password'}
            {step === 'otp' && 'Verify OTP'}
            {step === 'password' && 'Reset Password'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {step === 'email' && (
            <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
              <p className="text-sm text-gray-600">
                Enter your email address and we'll send you a verification code to reset your password.
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="forgot-email" className="text-sm font-semibold text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full h-12 pl-12 pr-4 text-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50 focus:bg-white transition-all"
                    {...emailForm.register("email")}
                  />
                </div>
                {emailForm.formState.errors.email && (
                  <p className="text-xs text-red-500 mt-1">{emailForm.formState.errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-12 font-semibold text-sm rounded-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
              </Button>
            </form>
          )}

          {step === 'otp' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                We've sent a 6-digit verification code to <span className="font-semibold">{email}</span>
              </p>
              
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Verification Code
                </Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button
                onClick={handleOtpVerification}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-12 font-semibold text-sm rounded-xl transition-all duration-300"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-sm text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
              >
                Back to email
              </button>
            </div>
          )}

          {step === 'password' && (
            <form onSubmit={passwordForm.handleSubmit(handlePasswordReset)} className="space-y-4">
              <p className="text-sm text-gray-600">
                Enter your new password below.
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm font-semibold text-gray-700">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="w-full h-12 pl-12 pr-12 text-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50 focus:bg-white transition-all"
                    {...passwordForm.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {passwordForm.formState.errors.password && (
                  <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-semibold text-gray-700">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="w-full h-12 pl-12 pr-12 text-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50 focus:bg-white transition-all"
                    {...passwordForm.register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-12 font-semibold text-sm rounded-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

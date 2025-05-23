
import { AuthForm } from "@/components/auth/AuthForm"
import { AuthLayout } from "@/components/auth/AuthLayout"

export default function SignIn() {
  return (
    <AuthLayout 
      title="Welcome back"
      subtitle="Sign in to your account to continue your AI journey"
    >
      <AuthForm isSignIn={true} />
    </AuthLayout>
  )
}

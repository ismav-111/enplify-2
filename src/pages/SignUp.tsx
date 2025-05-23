
import { AuthForm } from "@/components/auth/AuthForm"
import { AuthLayout } from "@/components/auth/AuthLayout"

export default function SignUp() {
  return (
    <AuthLayout 
      title="Experience seamless enterprise information integration"
      subtitle="Achieve unparalleled user experience with our innovative Gen AI solution"
    >
      <AuthForm isSignIn={false} />
    </AuthLayout>
  )
}

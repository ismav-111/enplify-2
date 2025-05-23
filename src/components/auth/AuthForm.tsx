
import * as React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

type FormData = z.infer<typeof formSchema>

interface AuthFormProps {
  isSignIn?: boolean
}

export function AuthForm({ isSignIn = false }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
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
    
    // This is where you would integrate with your auth provider
    console.log(data)
    
    // Simulate auth process
    setTimeout(() => {
      setIsLoading(false)
      navigate("/")
    }, 1000)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {isSignIn ? "Sign In" : "Sign Up"}
        </CardTitle>
        <CardDescription>
          {isSignIn 
            ? "Enter your credentials to access your account" 
            : "Create an account to get started"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>{isSignIn ? "Sign In" : "Sign Up"}</>
              )}
            </Button>
          </form>
        </Form>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">OR</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button variant="outline" type="button" className="w-full flex items-center justify-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.991 13.512v-3.256H22.5c.11.568.225 1.136.225 1.883 0 5.257-3.547 8.986-8.861 8.986-5.126 0-9.318-4.113-9.318-9.182S8.738 2.762 13.864 2.762c2.458 0 4.52.908 6.106 2.376l-2.458 2.347c-.678-.652-1.864-1.391-3.649-1.391-3.1 0-5.535 2.544-5.535 5.675 0 3.13 2.436 5.675 5.535 5.675 2.436 0 3.818-1.195 4.655-2.782.452-.85.734-1.713.847-2.707h-5.374v-.443z" fill="#4285F4" />
              <path d="M11.991 13.512V9.824H22.5c.11.568.225 1.136.225 1.883 0 4.862-3.293 8.294-8.156 8.294-4.746 0-8.624-3.804-8.624-8.5s3.878-8.5 8.624-8.5c2.27 0 4.18.88 5.647 2.204l-2.464 2.375c-.637-.624-1.714-1.335-3.373-1.335-2.872 0-5.125 2.375-5.125 5.256 0 2.88 2.253 5.256 5.125 5.256 2.418 0 3.798-1.223 4.407-2.85.425-.826.68-1.671.793-2.642h-4.989v-.753z" fill="#4285F4" />
            </svg>
            <span>Sign {isSignIn ? "in" : "up"} with Google</span>
          </Button>
          
          <Button variant="outline" type="button" className="w-full flex items-center justify-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5 2.75C6.77208 2.75 3.75 5.77208 3.75 9.5V14.5C3.75 18.2279 6.77208 21.25 10.5 21.25H13.5C17.2279 21.25 20.25 18.2279 20.25 14.5V9.5C20.25 5.77208 17.2279 2.75 13.5 2.75H10.5Z" fill="#0078D4" />
              <path d="M8.82812 10.9214L8.82655 10.9203L8.82754 10.9214H8.82812ZM16.6125 11.4005C16.4404 11.5209 15.3217 12.0844 15.3217 13.4222V13.4245C15.3217 14.7657 16.6039 15.2694 16.6224 15.2767C16.6181 15.2937 16.4362 15.876 16.0366 16.4715C15.6812 16.9995 15.3117 17.5286 14.7519 17.5286C14.192 17.5286 14.0264 17.251 13.391 17.251C12.7672 17.251 12.5232 17.5371 12.0051 17.5371C11.487 17.5371 11.0961 17.0302 10.695 16.4929C10.185 15.7919 9.76014 14.7032 9.76014 13.662C9.76014 11.9897 10.8659 11.0981 11.9547 11.0981C12.4988 11.0981 12.9645 11.3928 13.3207 11.3928C13.6633 11.3928 14.1816 11.0768 14.8038 11.0768C15.0683 11.0768 15.8887 11.1 16.6125 11.4005ZM14.6793 10.407C14.9244 10.1111 15.1035 9.6919 15.1035 9.2726C15.1035 9.20724 15.0971 9.14187 15.0864 9.08506C14.7288 9.09986 14.2998 9.30275 13.9992 9.63896C13.7712 9.86058 13.5528 10.2798 13.5528 10.7034C13.5528 10.7773 13.5644 10.8511 13.5687 10.8703C13.5985 10.8787 13.6475 10.8872 13.6965 10.8872C14.0114 10.8872 14.4295 10.6951 14.6793 10.407Z" fill="white" />
            </svg>
            <span>Sign {isSignIn ? "in" : "up"} with Microsoft</span>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {isSignIn ? (
            <>
              Don't have an account?{" "}
              <Button variant="link" className="p-0 h-auto font-normal text-indigo-600" onClick={() => navigate("/signup")}>
                Sign up
              </Button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Button variant="link" className="p-0 h-auto font-normal text-indigo-600" onClick={() => navigate("/signin")}>
                Sign in
              </Button>
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  )
}

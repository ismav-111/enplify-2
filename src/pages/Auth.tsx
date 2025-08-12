import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase";

type FormType = "signin" | "signup";

const Auth = () => {
  const [formType, setFormType] = useState<FormType>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formType === "signin") {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Login successful!",
          description: "You have successfully logged in.",
        });
        handleSuccess();
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({
          title: "Signup successful!",
          description: "Your account has been created.",
        });
        handleSuccess();
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
        variant: "destructive",
        title: "Authentication failed.",
        description:
          error.message || "Failed to sign in. Please check your credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <div className="grid h-screen place-items-center bg-gray-100">
      <Card className="w-96 bg-white shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            {formType === "signin" ? "Sign In" : "Sign Up"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isLoading}
            >
              {isLoading
                ? "Loading..."
                : formType === "signin"
                  ? "Sign In"
                  : "Sign Up"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            {formType === "signin" ? (
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-bold text-blue-500 hover:text-blue-800"
                  onClick={() => setFormType("signup")}
                >
                  Sign Up
                </Link>
              </p>
            ) : (
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="font-bold text-blue-500 hover:text-blue-800"
                  onClick={() => setFormType("signin")}
                >
                  Sign In
                </Link>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;

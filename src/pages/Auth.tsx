"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { Chrome } from "lucide-react";
import { useFinance } from "@/context/FinanceContext";

const Auth: React.FC = () => {
  const { loginUser } = useFinance(); // No longer need userProfile directly from context here
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showError("Please enter both email and password.");
      return;
    }

    const loggedInProfile = loginUser(loginEmail); // Get the profile directly
    if (loggedInProfile) {
      showSuccess("Logged in successfully!");
      // Check if profile is complete using the returned profile
      if (loggedInProfile.mobile && loggedInProfile.balance > 0) {
        navigate("/dashboard");
      } else {
        navigate("/profile-setup");
      }
    } else {
      showError("Login failed. Please check your credentials.");
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) {
      showError("Please fill in all sign-up fields.");
      return;
    }

    const newProfile = loginUser(signupEmail, signupName); // Get the new profile directly
    if (newProfile) {
      showSuccess("Account created successfully!");
      navigate("/profile-setup"); // Always navigate to profile setup for new users
    } else {
      showError("Sign up failed. Please try again.");
    }
  };

  const handleGoogleAuth = (type: "login" | "signup") => {
    // Simulate Google authentication by logging in with a generic Google email
    const googleEmail = "google_user@example.com";
    const googleProfile = loginUser(googleEmail, "Google User"); // Get the profile directly
    if (googleProfile) {
      showSuccess(`Successfully ${type === "login" ? "logged in" : "signed up"} with Google!`);
      if (googleProfile.mobile && googleProfile.balance > 0) {
        navigate("/dashboard");
      } else {
        navigate("/profile-setup");
      }
    } else {
      showError("Google authentication failed.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-16rem)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome to FinAssist</CardTitle>
          <CardDescription>
            Login or create an account to manage your finances.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-4">
              <form onSubmit={handleLogin} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="m@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleGoogleAuth("login")}
                  type="button"
                >
                  <Chrome className="mr-2 h-4 w-4" /> Google
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup" className="mt-4">
              <form onSubmit={handleSignUp} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="m@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleGoogleAuth("signup")}
                  type="button"
                >
                  <Chrome className="mr-2 h-4 w-4" /> Google
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
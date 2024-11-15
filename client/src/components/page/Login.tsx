"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Github } from "lucide-react";
import { githubAuth, googleAuth } from "@/lib/api/auth";

interface LoginProps {
  onEmailSubmit?: (email: string) => void;
  onGoogleLogin?: () => void;
  onGithubLogin?: () => void;
  onSignUp?: () => void;
  logoText?: string;
}

export function Login({
  onEmailSubmit,
  onGoogleLogin,
  onGithubLogin,
  onSignUp,
  logoText = "TM",
}: LoginProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-white">
      <Card className="w-full max-w-md bg-white border-gray-200 p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo with light theme styling */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-md transform hover:scale-105 transition-transform">
            <span className="text-white text-3xl font-bold">{logoText}</span>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold text-gray-900">
              Welcome to Task Management
            </h1>
            <p className="text-gray-500">
              Sign in to manage your tasks efficiently
            </p>
          </div>

          {/* Email Input Form */}
          {/* <form onSubmit={handleEmailSubmit} className="w-full space-y-4">
            <Input
              type="email"
              placeholder="Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border-gray-200 text-gray-900 h-12 focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white hover:bg-blue-600 h-12"
            >
              Continue with Email
            </Button>
          </form> */}

          {/* Divider */}
          {/* <div className="w-full flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div> */}

          {/* Social Login Buttons */}
          <div className="w-full space-y-3">
            {/* Google Login */}
            <Button
              onClick={() => googleAuth.signInWithGoogle()}
              variant="outline"
              className="w-full bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </div>
            </Button>

            {/* GitHub Login */}
            <Button
              onClick={() => githubAuth.signInWithGithub()}
              variant="outline"
              className="w-full bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
            >
              <div className="flex items-center justify-center space-x-2">
                <Github className="h-5 w-5" />
                <span>Continue with GitHub</span>
              </div>
            </Button>
          </div>

          {/* Sign Up Link */}
          {/* <div className="text-gray-500">
            Don't have an account?{" "}
            <button
              onClick={onSignUp}
              className="text-blue-500 hover:underline"
            >
              Sign Up
            </button>
          </div> */}
        </div>
      </Card>
    </div>
  );
}

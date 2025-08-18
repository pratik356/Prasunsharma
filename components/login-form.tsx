"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { signIn } from "@/lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        <>
          <Lock className="mr-2 h-4 w-4" />
          Sign In
        </>
      )}
    </Button>
  )
}

export default function LoginForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(signIn, null)
  const [showOTPStep, setShowOTPStep] = useState(false)

  useEffect(() => {
    if (state?.success && state?.requiresOTP) {
      setShowOTPStep(true)
    }
  }, [state])

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <p className="text-muted-foreground">
            {showOTPStep ? "Enter the OTP sent to your email" : "Access the portfolio management dashboard"}
          </p>
        </CardHeader>
        <CardContent>
          {!showOTPStep ? (
            <form action={formAction} className="space-y-4">
              {state?.error && (
                <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-lg text-sm">
                  {state.error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium">
                  Username
                </label>
                <Input id="username" name="username" type="text" placeholder="Enter username" required />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Input id="password" name="password" type="password" required />
              </div>

              <SubmitButton />
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/50 text-green-700 px-4 py-3 rounded-lg text-sm">
                ✅ OTP has been sent to prasun.sharm@gmail.com. Please check your inbox and spam folder.
              </div>
              {state?.devOTP && (
                <div className="bg-blue-500/10 border border-blue-500/50 text-blue-700 px-4 py-3 rounded-lg text-sm">
                  <strong>Development Mode - Your OTP:</strong> {state.devOTP}
                </div>
              )}
              <Button onClick={() => router.push("/auth/verify-otp")} className="w-full" size="lg">
                Continue to OTP Verification
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

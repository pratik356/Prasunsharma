"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Shield, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { verifyOTP } from "@/lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Verifying...
        </>
      ) : (
        <>
          <Shield className="mr-2 h-4 w-4" />
          Verify OTP
        </>
      )}
    </Button>
  )
}

export default function OTPForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(verifyOTP, null)

  useEffect(() => {
    if (state?.success) {
      router.push("/admin")
    }
  }, [state, router])

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Verify OTP</CardTitle>
          <p className="text-muted-foreground">
            We've sent a 6-digit verification code to
            <br />
            <span className="font-medium">prasun.sharm@gmail.com</span>
          </p>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-lg text-sm">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="otp" className="block text-sm font-medium">
                Verification Code
              </label>
              <Input
                id="otp"
                name="otp"
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="text-center text-lg tracking-widest"
                required
              />
            </div>

            <SubmitButton />

            <div className="text-center text-sm text-muted-foreground">
              Didn't receive the email?{" "}
              <button type="button" onClick={() => router.push("/auth/login")} className="text-primary hover:underline">
                Back to login
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

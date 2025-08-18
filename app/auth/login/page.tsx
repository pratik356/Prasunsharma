import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import LoginForm from "@/components/login-form"

export default async function LoginPage() {
  const cookieStore = cookies()
  const adminSession = cookieStore.get("admin_session")?.value
  const otpVerified = cookieStore.get("otp_verified")?.value

  if (adminSession === "authenticated" && otpVerified === "true") {
    redirect("/admin")
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <LoginForm />
    </div>
  )
}

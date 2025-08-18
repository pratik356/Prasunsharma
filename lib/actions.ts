"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { sendOTPEmail, generateOTP } from "@/lib/email-service"

// Hardcoded admin credentials
const ADMIN_USERNAME = "Pratik556"
const ADMIN_PASSWORD = "Pratik.....1"
const ADMIN_EMAIL = "prasun.sharm@gmail.com"

export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const username = formData.get("username")
  const password = formData.get("password")

  if (!username || !password) {
    return { error: "Username and password are required" }
  }

  // Check hardcoded credentials
  if (username.toString() !== ADMIN_USERNAME || password.toString() !== ADMIN_PASSWORD) {
    return { error: "Invalid credentials" }
  }

  const otp = generateOTP()
  console.log("[v0] Generated OTP:", otp)

  // Store OTP in cookies (expires in 10 minutes)
  const cookieStore = cookies()
  cookieStore.set("pending_otp", otp, {
    maxAge: 600, // 10 minutes
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })
  cookieStore.set("otp_verified", "false", {
    maxAge: 600,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })

  try {
    console.log("[v0] Attempting to send OTP email via Resend")
    const result = await sendOTPEmail(otp)
    console.log("[v0] Email send result:", result)

    if (result.success) {
      console.log("[v0] OTP email sent successfully to prasun.sharm@gmail.com")
      return {
        success: true,
        requiresOTP: true,
      }
    } else {
      console.error("[v0] Failed to send OTP email:", result.error)
      return { error: `Failed to send OTP email: ${result.error}` }
    }
  } catch (error) {
    console.error("[v0] Exception sending OTP:", error)
    return { error: `Failed to send OTP: ${error.message}` }
  }
}

export async function verifyOTP(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const enteredOTP = formData.get("otp")

  if (!enteredOTP) {
    return { error: "OTP is required" }
  }

  const cookieStore = cookies()
  const storedOTP = cookieStore.get("pending_otp")?.value

  if (!storedOTP) {
    return { error: "OTP has expired. Please login again." }
  }

  if (enteredOTP.toString() !== storedOTP) {
    return { error: "Invalid OTP. Please try again." }
  }

  // Mark OTP as verified
  cookieStore.set("otp_verified", "true", {
    maxAge: 3600, // 1 hour
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })
  cookieStore.set("admin_session", "authenticated", {
    maxAge: 3600, // 1 hour
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })

  // Clear pending OTP
  cookieStore.delete("pending_otp")

  return { success: true }
}

export async function signOut() {
  const cookieStore = cookies()
  cookieStore.delete("admin_session")
  cookieStore.delete("otp_verified")
  cookieStore.delete("pending_otp")
  redirect("/auth/login")
}

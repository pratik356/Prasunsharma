import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { otp } = await request.json()

    // Get OTP data from cookies
    const otpDataCookie = request.cookies.get("otp_data")

    if (!otpDataCookie) {
      return NextResponse.json({ success: false, error: "OTP session expired" }, { status: 400 })
    }

    const otpData = JSON.parse(otpDataCookie.value)

    // Check if OTP is expired
    if (Date.now() > otpData.expires) {
      return NextResponse.json({ success: false, error: "OTP has expired" }, { status: 400 })
    }

    // Verify OTP
    if (otp === otpData.otp) {
      // Set authenticated session
      const response = NextResponse.json({ success: true })
      response.cookies.set("admin_authenticated", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60, // 24 hours
      })

      // Clear OTP data
      response.cookies.delete("otp_data")

      return response
    } else {
      return NextResponse.json({ success: false, error: "Invalid OTP" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] OTP verification error:", error)
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 })
  }
}

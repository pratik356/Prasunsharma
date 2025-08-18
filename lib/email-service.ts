import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOTPEmail(otp: string) {
  try {
    console.log("[v0] Starting OTP email send process")
    console.log("[v0] Generated OTP for admin access:", otp)

    const { data, error } = await resend.emails.send({
      from: "Portfolio Admin <onboarding@resend.dev>",
      to: ["prasun.sharm@gmail.com"],
      subject: "Portfolio Admin Panel - OTP Verification",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Verification</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Portfolio Admin Access</h1>
              <p style="color: #f0f0f0; margin: 10px 0 0 0;">Secure login verification</p>
            </div>
            
            <div style="background: #ffffff; padding: 40px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Your OTP Code</h2>
              <p style="font-size: 16px; margin-bottom: 30px;">Use this code to complete your admin panel login:</p>
              
              <div style="background: #f8f9fa; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                  ${otp}
                </div>
              </div>
              
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #856404;">
                  <strong>⚠️ Security Notice:</strong> This OTP expires in 10 minutes. Do not share this code with anyone.
                </p>
              </div>
              
              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                If you didn't request this login, please ignore this email.
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
              <p>Portfolio Management System</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error("[v0] Resend error:", error)
      return {
        success: false,
        error: error.message || "Failed to send email",
      }
    }

    console.log("[v0] Email sent successfully via Resend:", data?.id)
    return {
      success: true,
      messageId: data?.id,
    }
  } catch (error) {
    console.error("[v0] Error in email service:", error.message)
    return {
      success: false,
      error: error.message,
    }
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

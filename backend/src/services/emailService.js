import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
    if (!transporter) {
        console.log("Creating SMTP transporter...");
        console.log("  EMAIL_HOST:", process.env.EMAIL_HOST || "(undefined)");
        console.log("  EMAIL_PORT:", process.env.EMAIL_PORT || "(undefined)");
        console.log("  EMAIL_USER:", process.env.EMAIL_USER || "(undefined)");
        console.log("  EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "(set)" : "(undefined)");

        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT, 10) || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }
    return transporter;
}

export const verifyEmailConnection = async () => {
    try {
        const transport = getTransporter();
        await transport.verify();
        console.log("✅ Email service: SMTP connection verified");
        return true;
    } catch (error) {
        console.error("❌ Email service: SMTP connection failed");
        console.error("   Host:", process.env.EMAIL_HOST);
        console.error("   Port:", process.env.EMAIL_PORT);
        console.error("   User:", process.env.EMAIL_USER || "(empty)");
        console.error("   Error:", error.message);
        return false;
    }
};

export const sendResetEmail = async (email, token) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "LaunchHub Password Reset",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
                <h2 style="color: #1a1a1a;">Password Reset Request</h2>
                <p style="color: #555; font-size: 14px; line-height: 1.6;">
                    Hello,
                </p>
                <p style="color: #555; font-size: 14px; line-height: 1.6;">
                    You requested a password reset. Click the button below to create a new password:
                </p>
                <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; margin: 16px 0;">
                    Reset Password
                </a>
                <p style="color: #555; font-size: 14px; line-height: 1.6;">
                    This link expires in 15 minutes.
                </p>
                <p style="color: #888; font-size: 13px; line-height: 1.6;">
                    If you did not request this, please ignore this email.
                </p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
                <p style="color: #888; font-size: 12px;">
                    Adidas LaunchHub - Internal Product Launch Management Platform
                </p>
            </div>
        `,
    };

    const transport = getTransporter();
    const info = await transport.sendMail(mailOptions);
    return info;
};

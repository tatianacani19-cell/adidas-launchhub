import nodemailer from "nodemailer";

export const sendResetEmail = async (email, token) => {
    try {
        console.log("[EMAIL] Preparing to send reset email via Gmail SMTP...");

        const frontendUrl = process.env.FRONTEND_URL || 'https://adidas-launchhub.vercel.app';
        const cleanBaseUrl = frontendUrl.replace(/\/+$/, '');
        const resetLink = `${cleanBaseUrl}/reset-password/${token}`;

        console.log("[EMAIL]   To:", email);
        console.log("[EMAIL]   Reset link:", resetLink);

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || "smtp.gmail.com",
            port: process.env.EMAIL_PORT || 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"Adidas LaunchHub" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "LaunchHub - Restablecer Contraseña",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
                    <h2 style="color: #1a1a1a;">Password Reset Request</h2>
                    <p style="color: #555; font-size: 14px; line-height: 1.6;">
                        You requested a password reset. Click the button below to create a new password:
                    </p>
                    <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; margin: 16px 0;">
                        Reset Password
                    </a>
                    <p style="color: #555; font-size: 14px; line-height: 1.6;">
                        This link expires in 15 minutes.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
                    <p style="color: #888; font-size: 12px;">
                        Adidas LaunchHub - Internal Product Launch Management Platform
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("[EMAIL] Email sent successfully via Gmail SMTP! MessageId:", info.messageId);
        return info;

    } catch (error) {
        console.error("[EMAIL] FAILED to send email via Gmail SMTP:", error.message);
        throw error;
    }
};

export const sendResetPasswordEmail = sendResetEmail;
export const sendResetEmail = async (email, token) => {
    try {
        console.log("[EMAIL] Preparing to send reset email via Brevo REST API...");

        const frontendUrl = process.env.FRONTEND_URL || 'https://adidas-launchhub.vercel.app';
        const cleanBaseUrl = frontendUrl.replace(/\/+$/, '');
        const resetLink = `${cleanBaseUrl}/reset-password/${token}`;

        console.log("[EMAIL]   To:", email);
        console.log("[EMAIL]   Reset link:", resetLink);

        const senderEmail = process.env.EMAIL_USER || "tatianacani19@gmail.com";

        const payload = {
            sender: {
                name: "Adidas LaunchHub",
                email: senderEmail,
            },
            to: [{ email: email }],
            subject: "LaunchHub - Restablecer Contraseña",
            htmlContent: `
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

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": process.env.BREVO_API_KEY,
                "content-type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("[EMAIL] Brevo API Error response:", data);
            throw new Error(data.message || "Failed to send email via Brevo API");
        }

        console.log("[EMAIL] Email sent successfully via Brevo API! MessageId:", data.messageId);
        return data;

    } catch (error) {
        console.error("[EMAIL] FAILED to send email via Brevo API:", error.message);
        throw error;
    }
};

export const sendResetPasswordEmail = sendResetEmail;

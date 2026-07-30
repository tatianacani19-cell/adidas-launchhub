import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys, SendSmtpEmail } from '@getbrevo/brevo';

export const sendResetEmail = async (email, token) => {
    try {
        console.log("[EMAIL] Preparing to send reset email via Brevo API...");

        // Instancia directa de la API en la v6 de Brevo
        const apiInstance = new TransactionalEmailsApi();
        apiInstance.setApiKey(
            TransactionalEmailsApiApiKeys.apiKey,
            process.env.BREVO_API_KEY
        );

        const frontendUrl = process.env.FRONTEND_URL || 'https://adidas-launchhub.vercel.app';
        const cleanBaseUrl = frontendUrl.replace(/\/+$/, '');
        const resetLink = `${cleanBaseUrl}/reset-password/${token}`;

        console.log("[EMAIL]   To:", email);
        console.log("[EMAIL]   Reset link:", resetLink);

        const sendSmtpEmail = new SendSmtpEmail();
        sendSmtpEmail.subject = "LaunchHub - Restablecer Contraseña";
        sendSmtpEmail.htmlContent = `
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
        `;

        // El email remitente debe ser la cuenta que registraste en Brevo
        sendSmtpEmail.sender = {
            name: "Adidas LaunchHub",
            email: process.env.EMAIL_USER || "tatianacani19@gmail.com"
        };
        sendSmtpEmail.to = [{ email: email }];

        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("[EMAIL] Email sent successfully via Brevo API! MessageId:", data.body?.messageId || "OK");
        return data;

    } catch (error) {
        console.error("[EMAIL] FAILED to send email via Brevo API:", error.message);
        throw error;
    }
};

// Alias de compatibilidad por si tu controller importa con otro nombre
export const sendResetPasswordEmail = sendResetEmail;
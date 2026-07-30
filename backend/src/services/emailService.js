import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetEmail = async (email, token) => {
    try {
        console.log("[EMAIL] Preparing to send reset email via Resend API...");

        const frontendUrl = process.env.FRONTEND_URL || 'https://adidas-launchhub.vercel.app';
        const cleanBaseUrl = frontendUrl.replace(/\/+$/, '');
        const resetLink = `${cleanBaseUrl}/reset-password/${token}`;

        console.log("[EMAIL]   To:", email);
        console.log("[EMAIL]   Reset link:", resetLink);

        const response = await resend.emails.send({
            from: 'Adidas LaunchHub <onboarding@resend.dev>',
            to: [email],
            subject: 'LaunchHub - Restablecer Contraseña',
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
        });

        if (response.error) {
            console.error("[EMAIL] Resend returned an error:", response.error);
            throw new Error(response.error.message);
        }

        console.log("[EMAIL] Email sent successfully via Resend API! ID:", response.data.id);
        return response.data;

    } catch (error) {
        console.error("[EMAIL] FAILED to send email via Resend API:", error.message);
        throw error;
    }
};

// Alias para evitar errores si tu controller importa con otro nombre
export const sendResetPasswordEmail = sendResetEmail;
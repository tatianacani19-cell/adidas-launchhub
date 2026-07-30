import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetEmail = async (email, token) => {
    try {
        console.log("[EMAIL] Preparing to send reset email via Resend API...");

        const frontendUrl = process.env.FRONTEND_URL || 'https://adidas-launchhub.vercel.app';
        // Limpiamos barras inclinadas finales duplicadas si existen
        const cleanBaseUrl = frontendUrl.replace(/\/+$/, '');
        const resetLink = `${cleanBaseUrl}/reset-password/${token}`;

        console.log("[EMAIL]   To:", email);
        console.log("[EMAIL]   Reset link:", resetLink);

        // Enviamos la petición HTTP a través de la API de Resend
        const response = await resend.emails.send({
            from: 'Adidas LaunchHub <onboarding@resend.dev>',
            to: [email],
            subject: 'LaunchHub - Restablecer Contraseña',
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
            `
        });

        // Resend no lanza excepción automática si la API responde un error de dominio/correo
        if (response.error) {
            console.error("[EMAIL] Resend returned an error:", response.error);
            throw new Error(response.error.message);
        }

        console.log("[EMAIL] Email sent successfully via Resend API! ID:", response.data.id);
        return response.data;

    } catch (error) {
        console.error("[EMAIL] FAILED to send email via Resend API:");
        console.error("[EMAIL]   Error message:", error.message);
        throw error;
    }
};

// Exportamos también como alias por si tu controlador importa 'sendResetPasswordEmail'
export const sendResetPasswordEmail = sendResetEmail;
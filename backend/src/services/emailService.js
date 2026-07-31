import { Resend } from 'resend';

// Inicializamos Resend con la clave de entorno
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetEmail = async (email, token) => {
    try {
        console.log("[EMAIL] Iniciando envío de correo vía Resend API...");

        const recipientEmail = email.trim().toLowerCase();
        const frontendUrl = process.env.FRONTEND_URL || 'https://adidas-launchhub.vercel.app';
        const cleanBaseUrl = frontendUrl.replace(/\/+$/, '');
        const resetLink = `${cleanBaseUrl}/reset-password/${token}`;

        console.log("[EMAIL] Destinatario:", recipientEmail);
        console.log("[EMAIL] Enlace generado:", resetLink);

        // Dirección por defecto de pruebas en Resend (onboarding@resend.dev)
        const { data, error } = await resend.emails.send({
            from: 'Adidas LaunchHub <onboarding@resend.dev>',
            to: [recipientEmail],
            subject: 'LaunchHub - Restablecer Contraseña',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <h2 style="color: #1a1a1a; margin-top: 0;">Restablecer Contraseña</h2>
                    <p style="color: #555; font-size: 14px; line-height: 1.6;">
                        Has solicitado restablecer tu contraseña en Adidas LaunchHub. Haz clic en el siguiente botón para continuar:
                    </p>
                    <div style="text-align: center; margin: 24px 0;">
                        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                            Restablecer Contraseña
                        </a>
                    </div>
                    <p style="color: #555; font-size: 13px; line-height: 1.6;">
                        Este enlace caducará en 15 minutos. Si no solicitaste este cambio, puedes ignorar este correo.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
                    <p style="color: #888; font-size: 12px; margin: 0; text-align: center;">
                        Adidas LaunchHub — Plataforma de Gestión Interna
                    </p>
                </div>
            `
        });

        if (error) {
            console.error("[EMAIL] Error de respuesta en Resend:", error);
            throw new Error(error.message);
        }

        console.log("[EMAIL] ¡Correo enviado con éxito vía Resend! ID:", data.id);
        return data;

    } catch (error) {
        console.error("[EMAIL] FALLO al enviar el correo:", error.message);
        throw error;
    }
};

export const sendResetPasswordEmail = sendResetEmail;
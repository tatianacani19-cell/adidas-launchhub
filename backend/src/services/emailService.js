import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetPasswordEmail = async (toEmail, resetToken) => {
    try {
        console.log("[EMAIL] Preparing to send reset email via Resend API...");

        const frontendUrl = process.env.FRONTEND_URL || 'https://adidas-launchhub.vercel.app';
        // Limpiamos barras duplicadas por seguridad
        const cleanBaseUrl = frontendUrl.replace(/\/+$/, '');
        const resetUrl = `${cleanBaseUrl}/reset-password/${resetToken}`;

        console.log("[EMAIL]   To:", toEmail);
        console.log("[EMAIL]   Reset link:", resetUrl);

        // Resend te permite enviar desde 'onboarding@resend.dev' en modo prueba sin configurar dominio
        const data = await resend.emails.send({
            from: 'Adidas LaunchHub <onboarding@resend.dev>',
            to: [toEmail],
            subject: 'LaunchHub - Restablecer Contraseña',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Restablecer Contraseña</h2>
                    <p>Has solicitado restablecer tu contraseña para Adidas LaunchHub.</p>
                    <p>Haz clic en el siguiente enlace para continuar:</p>
                    <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; display: inline-block; margin: 15px 0;">
                        Restablecer Contraseña
                    </a>
                    <p>Este enlace expirará en 15 minutos.</p>
                </div>
            `
        });

        console.log("[EMAIL] Email sent successfully via Resend API! ID:", data.id);
        return { success: true, data };

    } catch (error) {
        console.error("[EMAIL] FAILED to send email via Resend API:");
        console.error("[EMAIL]   Error message:", error.message);
        throw error;
    }
};

export const sendResetEmail = async (email, token) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password/${token}`;

    console.log("[EMAIL] ────────────────────────────────────────");
    console.log("[EMAIL] Preparing to send reset email");
    console.log("[EMAIL]   To:", email);
    console.log("[EMAIL]   From:", process.env.EMAIL_USER);
    console.log("[EMAIL]   Subject: LaunchHub Password Reset");
    console.log("[EMAIL]   Reset link:", resetLink);

    const mailOptions = {
        from: `"LaunchHub" <${process.env.EMAIL_USER}>`,
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

    try {
        const transport = getTransporter();
        console.log("[EMAIL] Sending email via SMTP...");
        const info = await transport.sendMail(mailOptions);
        console.log("[EMAIL] Email sent successfully!");
        console.log("[EMAIL]   Message ID:", info.messageId);
        console.log("[EMAIL]   Accepted:", JSON.stringify(info.accepted));
        console.log("[EMAIL]   Rejected:", JSON.stringify(info.rejected));
        console.log("[EMAIL] ────────────────────────────────────────");
        return info;
    } catch (error) {
        console.error("[EMAIL] ────────────────────────────────────────");
        console.error("[EMAIL] FAILED to send email");
        console.error("[EMAIL]   To:", email);
        console.error("[EMAIL]   Error name:", error.name);
        console.error("[EMAIL]   Error message:", error.message);
        if (error.code) console.error("[EMAIL]   Error code:", error.code);
        if (error.response) console.error("[EMAIL]   SMTP response:", error.response);
        if (error.responseCode) console.error("[EMAIL]   Response code:", error.responseCode);
        if (error.envelope) console.error("[EMAIL]   Envelope:", JSON.stringify(error.envelope));

        if (error.message.includes("Invalid login") || error.message.includes("authentication")) {
            console.error("[EMAIL]   >>> AUTHENTICATION FAILED <<<");
            console.error("[EMAIL]   Your Gmail App Password may be invalid or expired.");
            console.error("[EMAIL]   Steps to fix:");
            console.error("[EMAIL]     1. Go to https://myaccount.google.com/apppasswords");
            console.error("[EMAIL]     2. Generate a new App Password");
            console.error("[EMAIL]     3. Update EMAIL_PASSWORD in backend/.env");
            console.error("[EMAIL]     4. Restart the server");
        }

        if (error.message.includes("ECONNREFUSED") || error.message.includes("ETIMEDOUT")) {
            console.error("[EMAIL]   >>> CONNECTION FAILED <<<");
            console.error("[EMAIL]   Cannot reach Gmail SMTP server.");
            console.error("[EMAIL]   Check your internet connection and firewall settings.");
        }
        console.error("[EMAIL] ────────────────────────────────────────");
        throw error;
    }
};

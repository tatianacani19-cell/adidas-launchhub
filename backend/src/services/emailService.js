import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
    // Si ya existe pero queremos asegurar la nueva configuración, reiniciamos
    console.log("[EMAIL] Creating fresh SMTP transporter...");

    const port = parseInt(process.env.EMAIL_PORT, 10) || 587;
    const isSecure = port === 465;

    console.log("[EMAIL]   Host:", process.env.EMAIL_HOST || "smtp.gmail.com");
    console.log("[EMAIL]   Port:", port);
    console.log("[EMAIL]   Secure:", isSecure);

    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: port,
        secure: isSecure, // false para 587, true para 465
        requireTLS: port === 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
        family: 4, // 👈 FUERZA IPv4 EN CADA PETICIÓN
        dnsTimeout: 10000,
        tls: {
            rejectUnauthorized: false
        },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 15000,
    });

    return transporter;
}

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

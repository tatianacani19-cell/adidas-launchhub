import dotenv from "dotenv";
dotenv.config();

import { verifyEmailConnection, sendResetEmail } from "./services/emailService.js";

async function testEmail() {
    console.log("=== Email Service Test ===\n");

    console.log("Environment:");
    console.log("  EMAIL_HOST:", process.env.EMAIL_HOST || "(empty)");
    console.log("  EMAIL_PORT:", process.env.EMAIL_PORT || "(empty)");
    console.log("  EMAIL_USER:", process.env.EMAIL_USER || "(empty)");
    console.log("  EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "***set***" : "(empty)");
    console.log("  FRONTEND_URL:", process.env.FRONTEND_URL || "(empty)");
    console.log("");

    const connected = await verifyEmailConnection();
    if (!connected) {
        console.log("\n❌ Cannot connect to SMTP server. Check credentials.");
        process.exit(1);
    }

    const testEmail = process.env.EMAIL_USER;
    if (!testEmail) {
        console.log("\n❌ EMAIL_USER is empty. Set it in .env to test.");
        process.exit(1);
    }

    console.log("\nSending test email to:", testEmail);
    try {
        const info = await sendResetEmail(testEmail, "test-token-12345");
        console.log("\n✅ Test email sent successfully!");
        console.log("   Message ID:", info.messageId);
    } catch (error) {
        console.log("\n❌ Failed to send test email:");
        console.log("   Error:", error.message);
        if (error.code) console.log("   Code:", error.code);
        if (error.response) console.log("   SMTP Response:", error.response);
    }
}

testEmail();

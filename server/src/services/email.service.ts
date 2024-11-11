import SMTPTransport from "nodemailer/lib/smtp-transport";
import { authConfig } from "../utils/auth.config";
import nodemailer from "nodemailer";
import { injectable } from "tsyringe";

@injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const options: SMTPTransport.Options = {
      host: authConfig.smtpHost,
      port: authConfig.smtpPort,
      secure: false,
      auth: {
        user: authConfig.smtpApikeyPublic,
        pass: authConfig.smtpApikeyPrivate,
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: "SSLv3",
      },
    };

    this.transporter = nodemailer.createTransport(options);
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    try {
      // Verify connection configuration
      await this.transporter.verify();

      const verificationUrl = `${authConfig.appUrl}/verify-email?token=${token}`;

      const mailOptions = {
        from: {
          name: "Task Management",
          address: "noreply@taskmanagement.com",
        },
        to: email,
        subject: "Verify Your Email",
        html: `
          <h1>Welcome to Task Management!</h1>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationUrl}" style="
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin: 10px 0;
          ">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
          <p>If you did not create an account, please ignore this email.</p>
        `,
        text: `Welcome to Task Management! Please verify your email by clicking this link: ${verificationUrl}`,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Email sending error:", error);
      throw new Error("Failed to send verification email");
    }
  }
}

require('dotenv').config();
import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";

export interface EmailOptions {
    email: string;
    subject: string;
    template?: string; 
    data?: Record<string, any>; 
    html?: string; 
    text?: string; 
  }
  
const sendMail = async (options: EmailOptions): Promise<void> => {
    const transporter: Transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  
    const { email, subject, template, data, html } = options;
  
    let renderedHtml = html;
  
    // If a template is provided, render it
    if (template) {
      const templatePath = path.join(__dirname, '../mails', template);
      renderedHtml = await ejs.renderFile(templatePath, data || {});
    }
  
    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject,
      html: renderedHtml, // Use the rendered HTML or directly provided HTML
      text: options.text, // Fallback to plain text if available
    };
  
    await transporter.sendMail(mailOptions);
};
  
export default sendMail;
  
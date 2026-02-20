
import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, content) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    const mailOptions = {
        from: `<${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        text: content,
        html: `
            <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                <h2 style="color: #4A90E2;">Notificación de Marketplace</h2>
                <p style="font-size: 16px; color: #333;">${content}</p>
                <br>
                <hr>
                <footer style="font-size: 12px; color: #888;">
                    Este es un correo automático, por favor no respondas a este mensaje.
                </footer>
            </div>
        `
    }
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Correo enviado con éxito:', info.response);
        return info;

    } catch (error) {
        console.log('❌Error al enviar correo:', error);
        throw error ('No se puede enviar correo de confirmación')
    }
}
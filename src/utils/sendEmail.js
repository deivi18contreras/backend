import nodemailer from 'nodemailer';


let transporter = null;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, 
            }
        });
    }
    return transporter;
};


export const sendEmail = async (to, subject, content) => {
    const mailOptions = {
        from: `"Marketplace Inteligente" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text: content,
        html: `
            <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                <h2 style="color: #4A90E2;">Notificación de Marketplace</h2>
                <p style="font-size: 16px; color: #333;">${content}</p>
                <br><hr>
                <footer style="font-size: 12px; color: #888;">
                    Este es un correo automático, por favor no respondas a este mensaje.
                </footer>
            </div>
        `
    };

    try {
        const info = await getTransporter().sendMail(mailOptions);
        console.log('✅ Correo enviado con éxito:', info.response);
        return info;
    } catch (error) {
        console.error('❌ Error al enviar correo:', error);
        throw new Error('No se pudo enviar el correo de confirmación');
    }
};


export const sendResetCode = async (email, code) => {
    try {
        await getTransporter().sendMail({ 
            from: `"Marketplace Soporte" <${process.env.EMAIL_USER}>`, 
            to: email,
            subject: "Código de recuperación de contraseña",
            html: `
                <div style="text-align: center; font-family: sans-serif;">
                    <h2>Recuperación de contraseña</h2>
                    <p>Tu código de verificación es:</p>
                    <h1 style="letter-spacing: 8px; color: #4F46E5; font-size: 40px;">${code}</h1>
                    <p>Este código expira en <strong>15 minutos</strong>.</p>
                    <p>Si no solicitaste este código, ignora este mensaje.</p>
                </div>
            `,
        });
        console.log(`✅ Código de recuperación enviado a: ${email}`);
    } catch (error) {
        console.error('❌ Error enviando código de reset:', error);
        throw new Error('Error al enviar el código de recuperación');
    }
};
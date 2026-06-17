import nodemailer from "nodemailer";

export const sendVerificationEmail = async (to, code) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"Ruta Express" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Código de verificación - Ruta Express",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Verificación de correo</h2>
        <p>Tu código de verificación es:</p>
        <h1 style="letter-spacing: 4px;">${code}</h1>
        <p>Este código vence en 10 minutos.</p>
        <p>Ruta Express</p>
      </div>
    `
  });
};
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const confirmLink = `http://localhost:3000/verification?token=${token}`;

    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Confirm your email',
      html: `<p>Перейдите по <a href=${confirmLink}>ссылке</a> для подтверждения email</p>`,
    });
  } catch (error) {
    console.error('Ошибка при отправке email-токена: ', error);
    throw error;
  }
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  try {
    const confirmLink = `http://localhost:3000/new-password?token=${token}&email=${email}`;

    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Reset Password',
      html: `<p>Перейдите по <a href=${confirmLink}>ссылке</a> для сброса пароля</p>`,
    });
  } catch (error) {
    console.error('Ошибка при отправке resetPassword-токена: ', error);
    throw error;
  }
};

export const sendTwoFactorToken = async (email: string, token: string) => {
  try {
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Two factor authentification',
      html: `<p>Введите этот код ${token}</p>`,
    });
  } catch (error) {
    console.error('Ошибка при отправке twoFactor-токена: ', error);
    throw error;
  }
};

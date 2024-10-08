import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/api/verification?token=${token}`;

  try {
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Confirm your email',
      html: `<p>Click <a href=${confirmLink}>here</a> to confirm email</p>`,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/api/new-password?token=${token}&email=${email}`;

  try {
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Reset Password',
      html: `<p>Click <a href=${confirmLink}>here</a> to reset password</p>`,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const sendTwoFactorToken = async (email: string, token: string) => {
  try {
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Two factor authentification',
      html: `<p>Enter this code ${token}</p>`,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

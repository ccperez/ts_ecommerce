import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const from = '"DomainEmail" <info@emaildomain.com>'

const { EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD } = process.env

const EMAIL_PORT: number = parseInt(
  (process.env.EMAIL_PORT || '2525') as string,
  10
)

const setup = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
})

export function emailResetPasswordOTP({
  user,
  otp,
}: {
  user: {
    name: string
    email: string
  }
  otp: number
}) {
  const transport = setup

  const email = {
    from,
    to: user.email,
    subject: 'Reset Password OTP',
    html: `
    <p>Hi, ${user.name}<p />
    <p>
			Here is your generate OTP
			<h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0; color: #fff; border-radius: 4px;">${otp}</h2>
			to reset the your password procedure.
			<p>Note: OTP is valid for 1 minute</p>
		</p>
    <p>Regards, <br />System Admin</p>
    `,
  }

  transport.sendMail(email)
}

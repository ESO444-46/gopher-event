const crypto = require('crypto')
const SendEmail = require("../utils/email")
const userRepo = require('../repositories/user.repo');
const otpRepo = require("../repositories/otp.repo")
const bcrypt = require('bcrypt')
const saltRounds = 10
const utils = require('../utils/auth.utils');

const MAX_OTP_ATTEMPTS = 5
const failedOtpAttempts = new Map()

async function signup(userData) {
    const { firstName, lastName, email, password } = userData

    const existingUser = await userRepo.findByEmail(email);

    if (existingUser) {
        throw new Error('Email already registered')
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const createdUser = await userRepo.createUser({
        firstName,
        lastName,
        email,
        password: hashedPassword
    })

    return {
        id: createdUser.id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        createdAt: createdUser.createdAt,
    };

}


async function login(userData) {
    const { email, password } = userData

    const user = await userRepo.findByEmail(email)

    if (!user) {
        throw new Error('INVALID_CREDENTIALS')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('INVALID_CREDENTIALS')
    }

    if (!user.isVerified) {
        throw new Error('EMAIL_NOT_VERIFIED')
    }

    const accessToken = utils.generateAccessToken({
        userId: user.id,
        email: user.email
    })



    return {
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isOrganizer: user.isOrganizer
        },
        accessToken
    }
}

async function sendVerificationOtp(email) {
    const otpCode = String(crypto.randomInt(100_000, 1_000_000));
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

    failedOtpAttempts.delete(email)

    const record = await otpRepo.saveOtp({ email, otpCode, expiresAt });
    await SendEmail({
        to: email,
        subject: "Verify your Gopher Event account",
        text: `Your Gopher Event verification code is ${otpCode}. It expires in 15 minutes. If you did not request this code, you can ignore this email.`,
        html: `
          <div style="margin:0;padding:32px 16px;background:#FAF6EE;font-family:Arial,sans-serif;color:#2A2320;">
            <div style="max-width:600px;margin:0 auto;background:#FFFDF9;border:1px solid #E4DACB;border-radius:16px;overflow:hidden;">
              <div style="padding:28px 32px;background:#7A0019;border-bottom:4px solid #FFC72C;">
                <p style="margin:0;color:#FFC72C;font-size:12px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;">Gopher Event</p>
                <h1 style="margin:10px 0 0;color:#FFFDF9;font-family:Georgia,serif;font-size:28px;line-height:1.2;">Verify your email.</h1>
              </div>
              <div style="padding:32px;">
                <p style="margin:0 0 20px;font-size:16px;line-height:1.6;">Use this code to finish creating your account. It expires in 15 minutes.</p>
                <div style="margin:0 0 20px;padding:18px;background:#FAF6EE;border:1px solid #E4DACB;border-radius:12px;color:#7A0019;font-size:30px;font-weight:700;letter-spacing:8px;text-align:center;">${otpCode}</div>
                <p style="margin:0;color:#6b5f56;font-size:14px;line-height:1.6;">If you did not request this code, you can safely ignore this email.</p>
              </div>
            </div>
          </div>`
    });
}

async function verifyUserOtp({ email, otpCode }) {

    // finds otp
    const otpRecord = await otpRepo.findOtpByEmail(email)

    if (!otpRecord) {
        throw new Error("Invalid or expired verification code")
    }

    // checks expiry
    if (new Date() > otpRecord.expires_at) {
        failedOtpAttempts.delete(email)
        throw new Error("Verification code has expired")
    }

    if (otpRecord.otp_code !== otpCode) {
        const attempts = (failedOtpAttempts.get(email) || 0) + 1

        if (attempts >= MAX_OTP_ATTEMPTS) {
            failedOtpAttempts.delete(email)
            await otpRepo.deleteOtpByEmail(email)
            throw new Error("Too many incorrect attempts. Please request a new verification code")
        }

        failedOtpAttempts.set(email, attempts)
        throw new Error("Incorrect verification code")
    }

    // All checks passed, update the user to verified and delete the OTP record
    failedOtpAttempts.delete(email)

    const user = await userRepo.updateUserVerifiedStatus(email, true);

    await otpRepo.deleteOtpByEmail(email)

    const accessToken = utils.generateAccessToken({
        userId: user.id,
        email: user.email
    })

    return {
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isOrganizer: user.isOrganizer
        },
        accessToken
    }
}

module.exports = {
    signup,
    login,
    sendVerificationOtp,
    verifyUserOtp
}


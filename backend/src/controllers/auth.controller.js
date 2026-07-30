const authService = require('../services/auth.service')
const { signupSchema, loginSchema, otpSchema } = require('../schemas/auth.schema');
const SendEmail = require('../utils/email');
const { welcomeEmail } = require('../utils/emailTemplates');

async function signup(req, res) {

    // Input Validation
    const result = signupSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: result.error.issues[0].message
        })
    }
    const validatedData = result.data

    try {

        // Saves user data into the Db records with flag ifVerified as false.
        const user = await authService.signup(validatedData);

        await authService.sendVerificationOtp(user.email)

        return res.json({
            success: true,
            message: 'Verification code sent to your email!',
        })


    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }

}

async function login(req, res) {
    const result = loginSchema.safeParse(req.body)

    if (!result.success) {
        return res.status(400).json({
            success: false,
            errors: result.error.flatten().fieldErrors
        })
    }

    const validatedData = result.data

    try {
        const result = await authService.login(validatedData)

        return res.status(200).json({
            success: true,
            message: "Login successful",
            ...result
        })

    } catch (error) {
        if (error.message === 'INVALID_CREDENTIALS') {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        if (error.message === 'EMAIL_NOT_VERIFIED') {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email before logging in'
            })
        }

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })

    }

}


async function verifyOtp(req, res) {

    try {
        const result = otpSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.error.issues[0].message });
        }

        // Calls service layer here
        const { user, accessToken } = await authService.verifyUserOtp(result.data);

        await SendEmail({
            to: user.email,
            ...welcomeEmail()
        });

        res.json({
            success: true,
            message: "OTP verified successfully",
            user,
            accessToken
        });

    } catch (error) {
        // Catches the error thrown by the service layer
        res.status(400).json({
            success: false,
            message: error.message // e.g., "Verification code has expired"
        });
    }


}




module.exports = {
    signup,
    login,
    verifyOtp
}







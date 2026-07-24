const authService = require('../services/auth.service')
const { signupSchema, loginSchema, otpSchema } = require('../schemas/auth.schema');
const SendEmail = require('../utils/email');

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
            text: "Your email is verified and your Gopher Event account is ready. Explore upcoming events whenever you're ready.",
            subject: "Welcome to Gopher Event",
            html: `
      <div style="margin:0;padding:32px 16px;background:#FAF6EE;font-family:Arial,sans-serif;color:#2A2320;">
        <div style="max-width:600px;margin:0 auto;background:#FFFDF9;border:1px solid #E4DACB;border-radius:16px;overflow:hidden;">
          <div style="padding:28px 32px;background:#7A0019;border-bottom:4px solid #FFC72C;">
            <p style="margin:0;color:#FFC72C;font-size:12px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;">Gopher Event</p>
            <h1 style="margin:10px 0 0;color:#FFFDF9;font-family:Georgia,serif;font-size:28px;line-height:1.2;">Welcome to Gopher Event.</h1>
          </div>
          <div style="padding:32px;">
            <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Your email is verified and your account is ready to go.</p>
            <p style="margin:0;color:#6b5f56;font-size:15px;line-height:1.6;">Explore upcoming campus events, reserve your spot, and find something worth putting on your calendar.</p>
          </div>
        </div>
      </div>
    `,
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







const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const SendEmail = async ({ from = 'GopherEvents <no-reply@gopherevent.com>', to, subject, text, html }) => {
    const { data, error } = await resend.emails.send({
        from,
        to,
        subject,
        text,
        html
    })

    return { data, error }
}

module.exports = SendEmail;

const escapeHtml = (value) => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

const formatEventStart = (value) => {
    const start = new Date(value)
    const options = { timeZone: 'America/Chicago' }

    return {
        date: start.toLocaleDateString('en-US', {
            ...options,
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }),
        time: start.toLocaleTimeString('en-US', {
            ...options,
            hour: 'numeric',
            minute: '2-digit',
            timeZoneName: 'short'
        })
    }
}

const emailLayout = ({ heading, content }) => `
    <div style="margin:0;padding:32px 16px;background:#FAF6EE;font-family:Arial,sans-serif;color:#2A2320;">
        <div style="max-width:600px;margin:0 auto;background:#FFFDF9;border:1px solid #E4DACB;border-radius:16px;overflow:hidden;">
            <div style="padding:28px 32px;background:#7A0019;border-bottom:4px solid #FFC72C;">
                <p style="margin:0;color:#FFC72C;font-size:12px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;">Gopher Event</p>
                <h1 style="margin:10px 0 0;color:#FFFDF9;font-family:Georgia,serif;font-size:28px;line-height:1.2;">${heading}</h1>
            </div>
            <div style="padding:32px;">${content}</div>
        </div>
    </div>`

const eventDetails = ({ title, venue, startsAt }) => {
    const { date, time } = formatEventStart(startsAt)

    return {
        date,
        time,
        html: `
            <div style="padding:20px;border:1px solid #E4DACB;border-radius:12px;background:#FAF6EE;">
                <p style="margin:0 0 16px;color:#7A0019;font-family:Georgia,serif;font-size:20px;font-weight:700;">${escapeHtml(title)}</p>
                <p style="margin:0 0 8px;font-size:15px;line-height:1.5;"><strong>When</strong><br>${date} &middot; ${time}</p>
                <p style="margin:0;font-size:15px;line-height:1.5;"><strong>Where</strong><br>${escapeHtml(venue)}</p>
            </div>`
    }
}

const eventCreatedEmail = (event) => {
    const details = eventDetails(event)

    return {
        subject: `Your event is live: ${event.title}`,
        text: `Your event ${event.title} is now live on Gopher Event.\n\nWhen: ${details.date} at ${details.time}\nWhere: ${event.venue}\n\nStart sharing it with your community!`,
        html: emailLayout({
            heading: 'Your event is live.',
            content: `<p style="margin:0 0 24px;font-size:16px;line-height:1.6;">Your event is ready to share.</p>${details.html}<p style="margin:24px 0 0;color:#6b5f56;font-size:14px;line-height:1.6;">Start sharing it with your community.</p>`
        })
    }
}

const eventRegistrationEmail = (event) => {
    const details = eventDetails(event)
    const title = escapeHtml(event.title)

    return {
        subject: `You're registered: ${event.title}`,
        text: `You're confirmed for ${event.title}.\n\nWhen: ${details.date} at ${details.time}\nWhere: ${event.venue}\n\nSee you there!\nGopher Event`,
        html: emailLayout({
            heading: "You're on the list.",
            content: `<p style="margin:0 0 24px;font-size:16px;line-height:1.6;">Your spot for <strong>${title}</strong> is confirmed.</p>${details.html}<p style="margin:24px 0 0;color:#6b5f56;font-size:14px;line-height:1.6;">We'll see you there.</p>`
        })
    }
}

const welcomeEmail = () => ({
    subject: 'Welcome to Gopher Event',
    text: "Your email is verified and your Gopher Event account is ready. Explore upcoming events whenever you're ready.",
    html: emailLayout({
        heading: 'Welcome to Gopher Event.',
        content: '<p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Your email is verified and your account is ready to go.</p><p style="margin:0;color:#6b5f56;font-size:15px;line-height:1.6;">Explore upcoming campus events, reserve your spot, and find something worth putting on your calendar.</p>'
    })
})

module.exports = {
    eventCreatedEmail,
    eventRegistrationEmail,
    welcomeEmail
}

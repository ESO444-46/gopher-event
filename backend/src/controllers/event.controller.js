const eventSchema = require('../schemas/event.schema')
const eventService = require('../services/event.service')
const userService = require('../services/userEvent.service')
const generateEmbedding = require("../utils/embedding")
const SendEmail = require('../utils/email')

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

async function createEvent(req, res) {
    const result = eventSchema.createEvent.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({
            success: false,
            errors: result.error.flatten().fieldErrors
        })
    }

    const validatedData = {
        ...result.data,
        creatorId: req.user.userId
    };

    const formattedDate = new Date(validatedData.startsAt).toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short'
    })

    const context = `
    Title: ${validatedData.title}
    Venue: ${validatedData.venue}
    Date: ${formattedDate}
    Description: ${validatedData.description}
    `;

    try {
        const embedding = await generateEmbedding(context, 'RETRIEVAL_DOCUMENT')
        const event = await eventService.createEvent({ ...validatedData, embedding })

        const { title } = event
        const { date: eventDate, time: eventTime } = formatEventStart(event.startsAt)
        const eventTitle = escapeHtml(title)
        const eventVenue = escapeHtml(event.venue)
        const { error } = await SendEmail({
            to: req.user.email,
            subject: `Your event is live: ${title}`,
            text: `Your event ${title} is now live on Gopher Event.\n\nWhen: ${eventDate} at ${eventTime}\nWhere: ${event.venue}\n\nStart sharing it with your community!`,
            html: `
              <div style="margin:0;padding:32px 16px;background:#FAF6EE;font-family:Arial,sans-serif;color:#2A2320;">
                <div style="max-width:600px;margin:0 auto;background:#FFFDF9;border:1px solid #E4DACB;border-radius:16px;overflow:hidden;">
                  <div style="padding:28px 32px;background:#7A0019;border-bottom:4px solid #FFC72C;">
                    <p style="margin:0;color:#FFC72C;font-size:12px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;">Gopher Event</p>
                    <h1 style="margin:10px 0 0;color:#FFFDF9;font-family:Georgia,serif;font-size:28px;line-height:1.2;">Your event is live.</h1>
                  </div>
                  <div style="padding:32px;">
                    <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">Your event is ready to share.</p>
                    <div style="padding:20px;border:1px solid #E4DACB;border-radius:12px;background:#FAF6EE;">
                      <p style="margin:0 0 16px;color:#7A0019;font-family:Georgia,serif;font-size:20px;font-weight:700;">${eventTitle}</p>
                      <p style="margin:0 0 8px;font-size:15px;line-height:1.5;"><strong>When</strong><br>${eventDate} · ${eventTime}</p>
                      <p style="margin:0;font-size:15px;line-height:1.5;"><strong>Where</strong><br>${eventVenue}</p>
                    </div>
                    <p style="margin:24px 0 0;color:#6b5f56;font-size:14px;line-height:1.6;">Start sharing it with your community.</p>
                  </div>
                </div>
              </div>`
        });

        if (error) console.error("Email error occured", error)

        return res.status(201).json({
            success: true,
            event
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error in creating event'
        })
    }
}

async function updateEvent(req, res) {
    const paramResult = eventSchema.EventPublicIdParamSchema.safeParse(req.params)

    if (!paramResult.success) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Event Id'
        })
    }

    const bodyResult = eventSchema.createEvent.safeParse(req.body)
    if (!bodyResult.success) {
        return res.status(400).json({
            success: false,
            errors: bodyResult.error.flatten().fieldErrors
        })
    }

    const {
        title,
        description,
        venue,
        startsAt,
        endsAt,
        thumbnailUrl,
        bannerUrl
    } = bodyResult.data

    try {
        const event = await eventService.updateEvent({
            publicId: paramResult.data.publicId,
            creatorId: req.user.userId,
            title,
            description,
            venue,
            startsAt,
            endsAt,
            thumbnailUrl,
            bannerUrl
        })

        return res.status(200).json({
            success: true,
            event
        })
    } catch (err) {
        if (err.code === 'EVENT_NOT_FOUND') {
            return res.status(404).json({
                success: false,
                message: err.message
            })
        }

        return res.status(500).json({
            success: false,
            message: 'Error in updating event'
        })
    }
}

/*We can have rate limitng on this endpoint, since this */
async function getEvents(req, res) {
    try {

        const search = (req.query.search || "").trim()

        const events = await eventService.getEvents(search)

        return res.status(200).json({
            success: true,
            events
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch events'
        })
    }
}

const getEventByPublicId = async function (req, res) {
    const result = eventSchema.EventParamSchema.safeParse(req.params)

    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Event Id'
        })
    }

    try {
        const event = await eventService.getEventByPublicId(result.data.publicId)

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            })
        }

        return res.status(200).json({
            success: true,
            event
        })

    } catch (error) {
        console.error(`Failed to fetch event ${result.data.publicId}:`, error)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

async function registerUserForEvent(req, res) {
    const result = eventSchema.EventParamSchema.safeParse(req.params)

    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Event Id'
        })
    }

    try {
        const registration = await eventService.registerUserForEvent({
            userId: req.user.userId,
            publicId: result.data.publicId
        })

        const { date: eventDate, time: eventTime } = formatEventStart(registration.event.startsAt)
        const eventTitle = escapeHtml(registration.event.title)
        const eventVenue = escapeHtml(registration.event.venue)

        const { error } = await SendEmail({
            to: req.user.email,
            subject: `You're registered: ${registration.event.title}`,
            text: `You're confirmed for ${registration.event.title}.\n\nWhen: ${eventDate} at ${eventTime}\nWhere: ${registration.event.venue}\n\nSee you there!\nGopher Event`,
            html: `
              <div style="margin:0;padding:32px 16px;background:#FAF6EE;font-family:Arial,sans-serif;color:#2A2320;">
                <div style="max-width:600px;margin:0 auto;background:#FFFDF9;border:1px solid #E4DACB;border-radius:16px;overflow:hidden;">
                  <div style="padding:28px 32px;background:#7A0019;border-bottom:4px solid #FFC72C;">
                    <p style="margin:0;color:#FFC72C;font-size:12px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;">Gopher Event</p>
                    <h1 style="margin:10px 0 0;color:#FFFDF9;font-family:Georgia,serif;font-size:28px;line-height:1.2;">You’re on the list.</h1>
                  </div>
                  <div style="padding:32px;">
                    <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">Your spot for <strong>${eventTitle}</strong> is confirmed.</p>
                    <div style="padding:20px;border:1px solid #E4DACB;border-radius:12px;background:#FAF6EE;">
                      <p style="margin:0 0 16px;color:#7A0019;font-family:Georgia,serif;font-size:20px;font-weight:700;">${eventTitle}</p>
                      <p style="margin:0 0 8px;font-size:15px;line-height:1.5;"><strong>When</strong><br>${eventDate} · ${eventTime}</p>
                      <p style="margin:0;font-size:15px;line-height:1.5;"><strong>Where</strong><br>${eventVenue}</p>
                    </div>
                    <p style="margin:24px 0 0;color:#6b5f56;font-size:14px;line-height:1.6;">We’ll see you there.</p>
                  </div>
                </div>
              </div>`
        });

        if (error) console.error("Error sending email", error)

        return res.status(201).json({
            success: true,
            message: 'Registered for event'
        })

    } catch (error) {
        if (error.code === 'EVENT_NOT_FOUND') {
            return res.status(404).json({
                success: false,
                message: error.message
            })
        }

        if (error.code === 'ALREADY_REGISTERED') {
            return res.status(409).json({
                success: false,
                message: error.message
            })
        }

        // unexpected error
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}


async function getMyRegisteredEvents(req, res) {
    const { userId } = req.user

    try {
        const events = await userService.getMyRegisteredEvents(userId)

        return res.status(200).json(
            events
        )

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }

}


async function getMyCreatedEvents(req, res) {
    const { userId } = req.user

    try {
        const events = await eventService.getMyCreatedEvents(userId)
        return res.status(200).json(events)
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

async function getEventAttendees(req, res) {
    const { userId } = req.user
    const { publicId } = req.params

    const result = eventSchema.EventPublicIdParamSchema.safeParse({
        publicId
    })

    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: 'Invalid event Id'
        })
    }
    try {
        const attendees = await eventService.getEventAttendees(result.data.publicId, userId)
        return res.status(200).json({
            success: true,
            attendees

        })

    } catch (err) {
        if (err.code === 'EVENT_NOT_FOUND') {
            return res.status(404).json({
                success: false,
                message: err.message
            })
        }

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })

    }
}

module.exports = {
    createEvent,
    updateEvent,
    getEvents,
    getEventByPublicId,
    registerUserForEvent,
    getMyRegisteredEvents,
    getMyCreatedEvents,
    getEventAttendees
}

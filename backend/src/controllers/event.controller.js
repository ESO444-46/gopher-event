const eventSchema = require('../schemas/event.schema')
const eventService = require('../services/event.service')
const userService = require('../services/userEvent.service')
const generateEmbedding = require("../utils/embedding")
const SendEmail = require('../utils/email')
const { date } = require('zod')

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
        const { error } = await SendEmail({
            to: req.user.email,
            subject: `Event Created - ${title}`,
            text: `Hey! Your event "${title}" is now live on GopherEvents. Start sharing it with your campus!`
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

        const { error } = await SendEmail({
            to: req.user.email,
            subject: `RSVP Confirmed - ${registration.event.title}`,
            text: `Hey! You're confirmed for "${registration.event.title}" on ${registration.event.startsAt}. See you there!`
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

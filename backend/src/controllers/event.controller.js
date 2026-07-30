const eventSchema = require('../schemas/event.schema')
const eventService = require('../services/event.service')
const SendEmail = require('../utils/email')
const { eventCreatedEmail, eventRegistrationEmail } = require('../utils/emailTemplates')

async function createEvent(req, res) {
    const result = eventSchema.createEvent.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({ success: false, errors: result.error.flatten().fieldErrors })
    }

    try {
        const event = await eventService.createEvent({ ...result.data, creatorId: req.user.userId })
        const { error } = await SendEmail({ to: req.user.email, ...eventCreatedEmail(event) })

        if (error) console.error('Email error occurred', error)

        return res.status(201).json({ success: true, event })
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Error in creating event' })
    }
}

async function updateEvent(req, res) {
    const paramResult = eventSchema.EventPublicIdParamSchema.safeParse(req.params)
    if (!paramResult.success) {
        return res.status(400).json({ success: false, message: 'Invalid Event Id' })
    }

    const bodyResult = eventSchema.createEvent.safeParse(req.body)
    if (!bodyResult.success) {
        return res.status(400).json({ success: false, errors: bodyResult.error.flatten().fieldErrors })
    }

    try {
        const event = await eventService.updateEvent({
            publicId: paramResult.data.publicId,
            creatorId: req.user.userId,
            ...bodyResult.data
        })

        return res.status(200).json({ success: true, event })
    } catch (err) {
        if (err.code === 'EVENT_NOT_FOUND') {
            return res.status(404).json({ success: false, message: err.message })
        }

        return res.status(500).json({ success: false, message: 'Error in updating event' })
    }
}

async function getEvents(req, res) {
    try {
        const events = await eventService.getEvents((req.query.search || '').trim())
        return res.status(200).json({ success: true, events })
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to fetch events' })
    }
}

async function getEventByPublicId(req, res) {
    const result = eventSchema.EventPublicIdParamSchema.safeParse(req.params)
    if (!result.success) {
        return res.status(400).json({ success: false, message: 'Invalid Event Id' })
    }

    try {
        const event = await eventService.getEventByPublicId(result.data.publicId)
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' })
        }

        return res.status(200).json({ success: true, event })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

async function registerUserForEvent(req, res) {
    const result = eventSchema.EventPublicIdParamSchema.safeParse(req.params)
    if (!result.success) {
        return res.status(400).json({ success: false, message: 'Invalid Event Id' })
    }

    try {
        const registration = await eventService.registerUserForEvent({
            userId: req.user.userId,
            publicId: result.data.publicId
        })
        const { error } = await SendEmail({
            to: req.user.email,
            ...eventRegistrationEmail(registration.event)
        })

        if (error) console.error('Error sending email', error)

        return res.status(201).json({ success: true, message: 'Registered for event' })
    } catch (error) {
        if (error.code === 'EVENT_NOT_FOUND') {
            return res.status(404).json({ success: false, message: error.message })
        }

        if (error.code === 'ALREADY_REGISTERED') {
            return res.status(409).json({ success: false, message: error.message })
        }

        return res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

module.exports = {
    createEvent,
    updateEvent,
    getEvents,
    getEventByPublicId,
    registerUserForEvent
}

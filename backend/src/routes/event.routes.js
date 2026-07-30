const express = require('express')
const router = express.Router();

const eventController = require('../controllers/event.controller')
const { authMiddleware, requireOrganizer } = require('../middlewares/auth.middleware')

router.get('/', eventController.getEvents)

router.get('/:publicId', eventController.getEventByPublicId)

router.post('/', authMiddleware, requireOrganizer, eventController.createEvent)

router.put('/:publicId', authMiddleware, eventController.updateEvent)

router.post('/:publicId/rsvp', authMiddleware, eventController.registerUserForEvent)


module.exports = router

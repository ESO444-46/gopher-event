const prisma = require('../prisma/client')

async function exists(userId, eventId) {
    const record = await prisma.userEvent.findUnique({
        where: {
            userId_eventId: {
                userId, eventId
            }
        }
    })
    return !!record
}

async function createRegistration(userId, eventId) {
    return prisma.userEvent.create({
        data: {
            userId, eventId
        }
    })

}

module.exports = {
    exists,
    createRegistration
}

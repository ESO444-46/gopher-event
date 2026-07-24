const prisma = require('../prisma/client')


async function createEvent(eventData) {
    // 1. Convert the JS float array into a JSON string for pgvector
    const vectorString = JSON.stringify(eventData.embedding);

    // 2. Insert using raw SQL so Postgres handles ::vector casting
    const [newEvent] = await prisma.$queryRaw`
        INSERT INTO "Event" (
            "publicId",
            "title", 
            "description", 
            "venue", 
            "thumbnailUrl", 
            "bannerUrl", 
            "startsAt", 
            "endsAt", 
            "creatorId", 
            "embedding"
        )
        VALUES (
            gen_random_uuid(),
            ${eventData.title}, 
            ${eventData.description}, 
            ${eventData.venue}, 
            ${eventData.thumbnailUrl}, 
            ${eventData.bannerUrl}, 
            ${new Date(eventData.startsAt)}, 
            ${eventData.endsAt ? new Date(eventData.endsAt) : null}, 
            ${eventData.creatorId}, 
            ${vectorString}::vector
        )
        RETURNING "publicId", "title", "thumbnailUrl", "bannerUrl";
    `;

    // 3. Fetch the creator relation to match your required shape
    const creator = await prisma.user.findUnique({
        where: { id: eventData.creatorId },
        select: { firstName: true, lastName: true }
    });

    return { ...newEvent, creator };
}
async function updateEvent(eventData) {
    const event = await findByPublicIdAndCreatorId(eventData.publicId, eventData.creatorId)

    if (!event) {
        const err = new Error('Event not found')
        err.code = 'EVENT_NOT_FOUND'
        throw err
    }

    return prisma.event.update({
        where: {
            id: event.id
        },
        data: {
            title: eventData.title,
            description: eventData.description,
            venue: eventData.venue,
            thumbnailUrl: eventData.thumbnailUrl,
            bannerUrl: eventData.bannerUrl,
            startsAt: new Date(eventData.startsAt),
            endsAt: eventData.endsAt ? new Date(eventData.endsAt) : null
        },
        select: {
            publicId: true,
            title: true,
            description: true,
            venue: true,
            thumbnailUrl: true,
            bannerUrl: true,
            startsAt: true,
            endsAt: true
        }
    })
}

/*
Please change the lse to gte or else you will only see past events not current events

*/
async function getEvents(searchString) {
    return prisma.event.findMany({
        where: {
            startsAt: {
                gte: new Date()
            },
            title: {
                contains: searchString,
                mode: 'insensitive'
            }

        },
        orderBy: {
            startsAt: 'asc'
        },
        select: {
            publicId: true,
            title: true,
            venue: true,
            thumbnailUrl: true,
            startsAt: true,
            endsAt: true,

        }
    })
}

async function findEventByPublicId(publicId) {
    return prisma.event.findUnique({
        where: {
            publicId: publicId
        },
        select: {
            id: false,
            publicId: true,
            title: true,
            description: true,
            venue: true,
            thumbnailUrl: true,
            bannerUrl: true,
            startsAt: true,
            endsAt: true,
            createdAt: true,
            creator: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true
                }
            },
            capacity: true,
            totalRSVPs: true
        }
    })
}
async function findByPublicId(publicId) {
    return prisma.event.findUnique({
        where: { publicId }
    })
}

async function findEventsByCreatorId(creatorId) {
    return prisma.event.findMany({
        where: {
            creatorId
        },
        select: {
            publicId: true,
            title: true,
            venue: true,
            thumbnailUrl: true,
            startsAt: true,
            creator: {
                select: {
                    firstName: true
                }
            }
        }
    })
}

async function findByPublicIdAndCreatorId(publicId, creatorId) {
    return prisma.event.findFirst({
        where: {
            publicId,
            creatorId
        }
    })
}


module.exports = {
    createEvent,
    updateEvent,
    getEvents,
    findEventByPublicId,
    findByPublicId,
    findEventsByCreatorId,
    findByPublicIdAndCreatorId
};

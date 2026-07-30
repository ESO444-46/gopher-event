const z = require('zod')
const GRACE_MS = 60 * 60 * 1000// 1 hour

const createEvent = z.object({
    title: z
        .string()
        .trim()
        .min(5, 'Title should be more than 4 characters')
        .max(99, 'Title should be less than 100 characters'),

    description: z
        .string()
        .trim()
        .min(15, 'Description should be more than 14 characters')
        .max(1999, 'Description should be less than 2000 characters'),

    venue: z
        .string()
        .trim()
        .min(3, 'Venue should be more than 2 characters')
        .max(254, 'Venue should be less than 255 characters'),

    thumbnailUrl: z.string().url(),

    bannerUrl: z.string().url().optional().nullable(),

    startsAt: z.iso.datetime()
        .refine((val) => new Date(val).getTime() >= Date.now() - GRACE_MS,
            { message: 'Event start time must not be in the past' }),

    endsAt: z.iso.datetime()
})
    .superRefine((data, ctx) => {
        if (data.endsAt) {
            const startsAt = new Date(data.startsAt);
            const endsAt = new Date(data.endsAt);

            if (endsAt < startsAt) {
                ctx.addIssue({
                    path: ['endsAt'],
                    message: 'End time must be greater than or equla to start time'
                })
            }
        }
    })

const EventPublicIdParamSchema = z.object({
    publicId: z.uuid()
})
module.exports = {
    createEvent, EventPublicIdParamSchema
}

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Unsplash direct image URLs - free to use, no API key needed
const IMAGES = {
    techMeetup: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    aiWorkshop: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    startupNight: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
    leetcode: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    hackathon: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    careerFair: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
    openSource: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    mixer: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
}

async function main() {
    console.log('🌱 Seeding database with dummy data...')

    // ---------- USERS ----------
    const users = await Promise.all([
        prisma.user.upsert({
            where: { email: 'vajin001@umn.edu' },
            update: {},
            create: {
                firstName: 'Varshith',
                lastName: 'Vajinapelli',
                email: 'vajin001@umn.edu',
                password: 'hashed-password-1',
                isVerified: true,
                isOrganizer: true,
            },
        }),
        prisma.user.upsert({
            where: { email: 'bob@umn.edu' },
            update: {},
            create: {
                firstName: 'Bob',
                lastName: 'Smith',
                email: 'bob@umn.edu',
                password: 'hashed-password-2',
                isVerified: true,
                isOrganizer: true,
            },
        }),
        prisma.user.upsert({
            where: { email: 'alice@umn.edu' },
            update: {},
            create: {
                firstName: 'Alice',
                lastName: 'Johnson',
                email: 'alice@umn.edu',
                password: 'hashed-password-3',
                isVerified: true,
                isOrganizer: true,
            },
        }),
        prisma.user.upsert({
            where: { email: 'rahul@umn.edu' },
            update: {},
            create: {
                firstName: 'Rahul',
                lastName: 'Kumar',
                email: 'rahul@umn.edu',
                password: 'hashed-password-4',
                isVerified: true,
                isOrganizer: true,
            },
        }),
        prisma.user.upsert({
            where: { email: 'sneha@umn.edu' },
            update: {},
            create: {
                firstName: 'Sneha',
                lastName: 'Patel',
                email: 'sneha@umn.edu',
                password: 'hashed-password-5',
                isVerified: true,
                isOrganizer: true,
            },
        }),
    ])

    const [varshith, bob, alice, rahul, sneha] = users

    // ---------- EVENTS ----------
    const events = await Promise.all([
        prisma.event.create({
            data: {
                title: 'Gopher Tech Meetup',
                description: 'A casual meetup for CS students to connect, share side projects, and talk internships and full-time opportunities. Lightning talks welcome, sign up at the door.',
                venue: 'Coffman Memorial Union, Great Hall',
                thumbnailUrl: IMAGES.techMeetup,
                bannerUrl: IMAGES.techMeetup,
                startsAt: new Date('2026-10-10T18:00:00.000Z'),
                endsAt: new Date('2026-10-10T20:00:00.000Z'),
                creatorId: varshith.id,
            },
        }),
        prisma.event.create({
            data: {
                title: 'AI & ML Workshop',
                description: 'Hands-on introduction to machine learning. We will build a simple classifier from scratch using Python and scikit-learn. No prior ML experience needed, just bring your laptop.',
                venue: 'Keller Hall, Room 3-180',
                thumbnailUrl: IMAGES.aiWorkshop,
                bannerUrl: IMAGES.aiWorkshop,
                startsAt: new Date('2026-10-19T14:00:00.000Z'),
                endsAt: new Date('2026-10-19T17:00:00.000Z'),
                creatorId: alice.id,
            },
        }),
        prisma.event.create({
            data: {
                title: 'Startup Networking Night',
                description: 'Meet founders, builders, and investors from the Twin Cities startup scene. Come with your elevator pitch or just come to listen. Drinks and snacks provided.',
                venue: 'McNamara Alumni Center',
                thumbnailUrl: IMAGES.startupNight,
                bannerUrl: IMAGES.startupNight,
                startsAt: new Date('2026-10-05T17:30:00.000Z'),
                endsAt: new Date('2026-10-05T20:00:00.000Z'),
                creatorId: rahul.id,
            },
        }),
        prisma.event.create({
            data: {
                title: 'LeetCode Study Jam',
                description: 'Weekly group problem solving session focused on trees and graphs this week. Bring your laptop, we work through problems together and review solutions as a group.',
                venue: 'Walter Library, Room 402',
                thumbnailUrl: IMAGES.leetcode,
                bannerUrl: IMAGES.leetcode,
                startsAt: new Date('2026-10-08T19:00:00.000Z'),
                endsAt: new Date('2026-10-08T21:00:00.000Z'),
                creatorId: varshith.id,
            },
        }),
        prisma.event.create({
            data: {
                title: 'UMN Fall Hackathon 2026',
                description: 'A 24-hour hackathon where teams of up to 4 build projects from scratch. Prizes for best overall, best social impact, and best use of AI. Food and drinks provided throughout.',
                venue: 'Coffman Memorial Union, Mississippi Room',
                thumbnailUrl: IMAGES.hackathon,
                bannerUrl: IMAGES.hackathon,
                startsAt: new Date('2026-10-12T09:00:00.000Z'),
                endsAt: new Date('2026-10-13T09:00:00.000Z'),
                creatorId: bob.id,
            },
        }),
        prisma.event.create({
            data: {
                title: 'CSE Career Fair Prep Workshop',
                description: 'Learn how to craft a standout resume, nail your elevator pitch, and approach recruiters confidently. Hosted by the CSE Student Board with guest speakers from Google and Cloudflare.',
                venue: 'Keller Hall, Room 3-125',
                thumbnailUrl: IMAGES.careerFair,
                bannerUrl: IMAGES.careerFair,
                startsAt: new Date('2026-10-28T17:00:00.000Z'),
                endsAt: new Date('2026-10-28T19:00:00.000Z'),
                creatorId: sneha.id,
            },
        }),
        prisma.event.create({
            data: {
                title: 'Open Source Contribution Sprint',
                description: 'A 6-hour open source sprint where students contribute to real GitHub repositories. Maintainers from two Minnesota-based startups will be on-site to review PRs live.',
                venue: 'Shepherd Labs, Room 131',
                thumbnailUrl: IMAGES.openSource,
                bannerUrl: IMAGES.openSource,
                startsAt: new Date('2026-10-25T11:00:00.000Z'),
                endsAt: new Date('2026-10-25T17:00:00.000Z'),
                creatorId: alice.id,
            },
        }),
        prisma.event.create({
            data: {
                title: 'International Student Mixer',
                description: 'A casual welcome mixer for all international students. Meet peers, learn about campus resources, and connect with student organizations. Refreshments provided.',
                venue: 'Coffman Memorial Union, Sky Hall',
                thumbnailUrl: IMAGES.mixer,
                bannerUrl: IMAGES.mixer,
                startsAt: new Date('2026-10-01T15:00:00.000Z'),
                endsAt: new Date('2026-10-01T17:30:00.000Z'),
                creatorId: rahul.id,
            },
        }),
    ])

    const [event1, event2, event3, event4, event5, event6, event7, event8] = events

    // ---------- ATTENDANCE ----------
    await prisma.userEvent.createMany({
        data: [
            { userId: bob.id, eventId: event1.id },
            { userId: alice.id, eventId: event1.id },
            { userId: rahul.id, eventId: event1.id },
            { userId: varshith.id, eventId: event2.id },
            { userId: sneha.id, eventId: event2.id },
            { userId: bob.id, eventId: event3.id },
            { userId: sneha.id, eventId: event3.id },
            { userId: alice.id, eventId: event4.id },
            { userId: rahul.id, eventId: event4.id },
            { userId: sneha.id, eventId: event4.id },
            { userId: varshith.id, eventId: event5.id },
            { userId: alice.id, eventId: event5.id },
            { userId: bob.id, eventId: event6.id },
            { userId: rahul.id, eventId: event6.id },
            { userId: varshith.id, eventId: event7.id },
            { userId: sneha.id, eventId: event7.id },
            { userId: bob.id, eventId: event8.id },
            { userId: alice.id, eventId: event8.id },
        ],
        skipDuplicates: true,
    })

    console.log('✅ Seeding finished successfully — 5 users, 8 events, attendance links created')
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
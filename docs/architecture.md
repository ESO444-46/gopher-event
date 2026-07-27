# Architecture

Gopher Event uses a React frontend, an Express API, and PostgreSQL through Prisma.

```text
React + Vite frontend
        |
        | HTTP requests
        v
Express API
        |
        | Prisma
        v
PostgreSQL database
```

## Frontend

The frontend is in `frontend/src/`. React Router handles pages such as signup, login, events, event details, and event creation. API requests use the Axios client in `frontend/src/api/axios.js` and read the API URL from `VITE_API_URL`.

## Backend

The backend is in `backend/src/` and listens on port `5000`.

Requests move through these layers:

```text
routes -> controllers -> services -> repositories -> Prisma
```

Routes define the endpoint. Controllers validate the request and return the response. Services hold the app logic. Repositories read and write database records.

## Data

Prisma models are in `backend/prisma/schema.prisma`.

- `User` stores account details and organizer status.
- `Otp` stores email verification codes.
- `Event` stores event details and the organizer who created it.
- `UserEvent` connects users to events they registered for.

## Authentication

Signup sends a verification code by email. After OTP verification or login, the API returns a JWT access token. Protected routes expect:

```http
Authorization: Bearer <accessToken>
```

Creating an event also requires the user to have organizer status.

## External services

Resend sends verification, event-created, and RSVP emails. The project also includes Gemini and pgvector setup for future semantic event search, but that flow is not currently enabled.

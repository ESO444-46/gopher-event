# Deployment

The frontend is configured for Vercel in `frontend/vercel.json`. The rewrite rule sends app routes to `index.html` so React Router works after deployment.

## Frontend

Deploy the `frontend/` folder as a Vite project. Add this environment variable in the frontend host:

```text
VITE_API_URL=https://your-api-domain.com
```

Run `npm run build` to verify the production build locally.

## Backend

Deploy the `backend/` folder to a Node.js host. Set these environment variables:

```text
DATABASE_URL
JWT_SECRET
RESEND_API_KEY
```

`GEMINI_API_KEY` is only needed if semantic event search is enabled later.

Run Prisma migrations against the production database before starting the API:

```bash
npx prisma migrate deploy
```

Start the server with:

```bash
node src/server.js
```

## CORS

After deploying the frontend, add its exact domain to the `origin` list in `backend/src/app.js`. The backend must allow the deployed frontend domain before browser requests will work.

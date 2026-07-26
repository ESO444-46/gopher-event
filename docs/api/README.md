# Gopher Events API

The Express server listens on `http://localhost:5000` and exposes these route groups:

| Route group | Documentation                       |
| ----------- | ----------------------------------- |
| `/auth`     | [Authentication](authentication.md) |
| `/events`   | [Events](events.md)                 |

For protected endpoints, send the access token returned by login or OTP verification:

```http
Authorization: Bearer <accessToken>
```

Only routes registered in `backend/src/routes/` are documented here. Commented-out routes are not currently available.

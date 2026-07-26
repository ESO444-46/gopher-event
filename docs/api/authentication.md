# Authentication routes

Base path: `/auth`

## POST `/auth/signup`

Creates an unverified account and emails a six-digit verification code.

```json
{
  "firstName": "Goldy",
  "lastName": "Gopher",
  "email": "goldy@umn.edu",
  "password": "at-least-6-characters"
}
```

All fields are required. Names may be up to 30 characters, passwords must be 6-128 characters, and email addresses must end in `@umn.edu`.

**Success: `200`**

```json
{
  "success": true,
  "message": "Verification code sent to your email!"
}
```

Returns `400` for invalid input or an already-registered email.

## POST `/auth/verify-otp`

Verifies the emailed code and returns an access token.

```json
{
  "email": "goldy@umn.edu",
  "otpCode": "123456"
}
```

`otpCode` must contain exactly six digits.

**Success: `200`**

```json
{
  "success": true,
  "message": "OTP verified successfully",
  "user": {
    "id": 1,
    "firstName": "Goldy",
    "lastName": "Gopher",
    "email": "goldy@umn.edu",
    "isOrganizer": false
  },
  "accessToken": "jwt-access-token"
}
```

Returns `400` for an invalid, incorrect, or expired code.

## POST `/auth/login`

Authenticates a verified account.

```json
{
  "email": "goldy@umn.edu",
  "password": "at-least-6-characters"
}
```

**Success: `200`**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "firstName": "Goldy",
    "lastName": "Gopher",
    "email": "goldy@umn.edu",
    "isOrganizer": false
  },
  "accessToken": "jwt-access-token"
}
```

Returns `400` for invalid input, `401` for invalid credentials, and `403` when the email address has not been verified.

## Protected-route authentication

Send `Authorization: Bearer <accessToken>`. Invalid or missing tokens return `401`. The token gives the backend the current `userId` and `email`.

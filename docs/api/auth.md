> **Deprecated:** This file has been replaced by [authentication.md](authentication.md), which includes the current signup, OTP verification, login, and protected-route behavior.

## POST /auth/signup

### purpose

Create a new user account.

### Auth

Not required

### Request

Body:

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string"
}
```

### Validation Rules

- Email must end with @umn.edu
- All fields are required

### Response (201)

```json
{
  "success": true,
  "message": "Signup successfull",
  "user": {
    "id": "int",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "createdAt": "DateTime"
  }
}
```

### Error Responses

-400: Invalid input (email or password)
-409: Email already exists
-500: Internal server error

### Notes

- Password is hashed and salted before storing
- User is logged in immediately after signup

---

---

## POST auth/login

### purpose

Authenticate an existing user using email and password.

### Auth

Not required

### Request

Body:

```json
{
  "email": "string",
  "password": "string"
}
```

### Validation Rules

- Request body must match email & password schema
- Email must exist in the database
- Given password must match the stored hashed password

### Response (200)

```json
{
  "success": true,
  "message": "login successful",
  "user": {
    "id": "int",
    "firstName": "string",
    "lastName": "string",
    "email": "string"
  }
}
```

### Error Responses

- 401 Unauthorized: Invalid email or password

- 500 Internal server error: Unexpected server error

### Notes

2026-01-02: Access and refresh tokens are intentionally not implemented yet.
Token-based authentication will be added after frontend integration.

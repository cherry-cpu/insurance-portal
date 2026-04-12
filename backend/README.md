# Ratantatai — Spring Boot API

This service backs the React portal for **Razorpay order creation** and can be extended for policies, claims, and reporting.

## Run locally

Prerequisites: **JDK 17+** and **Maven**.

```bash
cd backend
set RAZORPAY_KEY_ID=rzp_test_xxxx
set RAZORPAY_KEY_SECRET=your_secret
mvn spring-boot:run
```

Health check: `GET http://localhost:8080/api/health`  
Create order (matches the React client): `POST http://localhost:8080/api/payments/create-order`

Example body:

```json
{
  "amountPaise": 125000,
  "receipt": "POL-TEST-1",
  "notes": { "policyNumber": "POL-TEST-1" }
}
```

Successful response includes Razorpay fields plus **`orderId`** (duplicate of `id`) and **`keyId`** for Checkout.

If keys are missing or Razorpay returns an error, the API responds with **503** and the React app falls back to **demo payment** (confirm dialog).

## CORS

Default allowed origin: `http://localhost:3000`. Override with:

`app.cors.allowed-origins=http://localhost:3000,https://your-domain.com`

## Database

Reference DDL for policies, payments, claims, documents, workflow, marketing, and audit is in `src/main/resources/schema.sql`. Wire **Spring Data JPA** (or JDBC) when you persist real data; the React app currently uses **session storage** for the demo flow.

## Environment variables

| Variable            | Purpose                          |
|---------------------|----------------------------------|
| `RAZORPAY_KEY_ID`   | Razorpay key id (test or live)   |
| `RAZORPAY_KEY_SECRET` | Razorpay secret (server only) |

Never expose the secret in the browser; only `REACT_APP_RAZORPAY_KEY_ID` belongs in the React `.env.local` file (same key id as the server).

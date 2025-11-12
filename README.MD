# 📦 Parcel Lift API

A secure, modular, and role-based backend API for a parcel delivery system, built with Express.js, Mongoose, and TypeScript. This robust system allows users to register as senders or receivers and manage parcel delivery operations seamlessly.

---

## ✨ Features

-   **Authentication:** Secure JWT-based authentication with access and refresh tokens.
-   **Social Login:** Integrated Google OAuth 2.0 for easy user registration and login.
-   **Role-Based Access Control (RBAC):** Distinct roles (**SUPER_ADMIN**, **ADMIN**, **SENDER**, **RECEIVER**) with protected routes to ensure users only access authorized resources.
-   **User Management:** Admins can view, manage, block, and unblock users.
-   **Parcel Management:**
    -   Senders can create, cancel, and track their parcels.
    -   Receivers can view incoming parcels and confirm delivery.
    -   Admins have full oversight to manage all parcels, update statuses, and block parcels.
-   **Advanced Querying:** Powerful filtering, searching, sorting, and pagination for fetching data.
-   **Status Tracking:** Each parcel includes an embedded history of status logs, making it easy to track its journey.
-   **Secure & Validated:** Uses `bcryptjs` for password hashing and `zod` for robust request validation.

---

## 🛠️ Tech Stack

-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB with Mongoose
-   **Language:** TypeScript
-   **Authentication:** JWT (JSON Web Tokens), Passport.js (for Google OAuth & Local Strategy)
-   **Validation:** Zod
-   **Dev Tools:** ESLint, ts-node-dev

---

## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   [MongoDB](https://www.mongodb.com/try/download/community) instance (local or cloud-based like MongoDB Atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/Arittro7/parcel_lift-backend
cd parcel_lift-backend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of your project and add the following environment variables. Replace the placeholder values with your actual configuration.

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
DB_URL=your_mongodb_connection_string

# JWT Secrets
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRES=30d

# Bcrypt
BCRYPT_SALT_ROUND=12

# Super Admin Credentials
SUPER_ADMIN_EMAIL=superadmin@example.com
SUPER_ADMIN_PASSWORD=your_super_strong_password

# Google OAuth 2.0 Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Express Session
EXPRESS_SESSION_SECRET=your_express_session_secret
```

### 4. Run the Development Server

Once the dependencies are installed and the environment variables are set, you can start the server.

```bash
npm run dev
```

The server will start on the port you specified in the `.env` file (e.g., `http://localhost:5000`). The first time you run the server, it will automatically seed a `SUPER_ADMIN` user with the credentials you provided.

---

##  API Endpoints

Here are some of the primary API endpoints available:

### Authentication (`/api/v1/auth`)

-   `POST /login`: User login with email and password.
-   `POST /refresh-token`: Generate a new access token using a refresh token.
-   `POST /logout`: Clear user session cookies.
-   `POST /reset-password`: Change user password (requires authentication).
### User Management (`/api/v1/user`)

-   `POST /register`: Register a new user.
-   `GET /all-users`: Get a list of all users. (**Super Admin & Admin Only**)
-   `PATCH /:id`: Update user information.
-   `PATCH /block/:id`: Block a user. (**Super Admin & Admin Only**)
-   `PATCH /unblock/:id`: Unblock a user. (**Super Admin & Admin Only**)

### Parcel Management (`/api/v1/parcels`)

-   `POST /`: Create a new parcel. (**Sender Only**)
-   `GET /my-parcels`: Get all parcels created by the logged-in sender. (**Sender Only**)
-   `GET /incoming`: Get all parcels for the logged-in receiver. (**Receiver Only**)
-   `GET /all-parcels`: Get all parcels in the system. (**Admin Only**)
-   `GET /:id`: Get details of a specific parcel.
-   `GET /track/:trackingId`: Track a parcel using its tracking ID.
-   `PATCH /cancel/:id`: Cancel a parcel. (**Sender Only**)
-   `PATCH /confirm-delivery/:id`: Confirm parcel delivery. (**Receiver Only**)
-   `PATCH /status/:id`: Update a parcel's status. (**Admin Only**)
    



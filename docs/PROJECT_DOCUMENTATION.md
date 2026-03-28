# Project Almgiver Documentation

## 1. Overview

Project Almgiver is a multi-college alumni fundraising platform where each college operates inside its own private workspace. Students, alumni, and admins can only access data that belongs to their college.

The platform supports:

- College-specific authentication and access control
- Campaign discovery and donations for users in the same college
- Admin-only campaign management, donor history, and college statistics
- Razorpay test-mode donation flow
- Forgot-password flow with reset-code generation

## 2. Tech Stack

### Frontend

- React.js with Vite
- Tailwind CSS
- Axios
- React Router
- React Hot Toast
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcryptjs
- Razorpay SDK

## 3. Architecture

### Frontend Structure

- `client/src/main.jsx` bootstraps the app
- `client/src/App.jsx` defines routes
- `client/src/context/AuthContext.jsx` manages auth state and user session
- `client/src/api/axios.js` configures API requests
- `client/src/pages/*` contains page-level UI
- `client/src/components/*` contains shared UI blocks

### Backend Structure

- `server/src/index.js` starts the Express server
- `server/src/config/db.js` connects to MongoDB
- `server/src/models/*` defines Mongoose schemas
- `server/src/controllers/*` contains business logic
- `server/src/routes/*` exposes REST endpoints
- `server/src/middleware/*` handles auth and errors
- `server/src/utils/*` provides helpers such as token generation

## 4. User Roles

### Student

- Can register under a college
- Can view campaigns for their own college
- Can donate to campaigns in their own college
- Can view personal donation history

### Alumni

- Can register under a college
- Can view campaigns for their own college
- Can donate to campaigns in their own college
- Can view personal donation history

### Admin

- Must register with a valid `ADMIN_REGISTRATION_KEY`
- Can manage campaigns for their own college only
- Can view college-specific donors, users, and stats
- Cannot access records from other colleges

## 5. College Isolation Rules

College separation is the core access rule in this project.

- Every user belongs to one college
- Every campaign belongs to one college
- Every donation belongs to one college
- Campaign listing is filtered by the logged-in user’s college
- Campaign detail access is blocked if the campaign belongs to a different college
- Admin dashboards only show users, campaigns, donations, and stats from the same college

## 6. Core Features

### Authentication

- Register
- Login
- JWT-based protected routes
- Hashed passwords using bcryptjs
- Forgot password
- Reset password using generated reset code

### Campaigns

- View all campaigns for current college
- View detailed campaign page
- Search campaigns
- Filter by status
- Track progress by collected amount vs goal

### Donations

- Create Razorpay order
- Verify payment signature
- Record successful donation in MongoDB
- Store donor details and payment details

### Admin

- Create campaign
- Edit campaign
- Delete campaign
- View donations
- View users
- View college-specific fundraising stats

## 7. Database Models

### College

- `name`
- `slug`

### User

- `name`
- `email`
- `password`
- `college`
- `role`
- `resetPasswordToken`
- `resetPasswordExpires`

### Campaign

- `title`
- `description`
- `goalAmount`
- `currentAmount`
- `deadline`
- `image`
- `college`
- `createdBy`

### Donation

- `userId`
- `campaignId`
- `college`
- `amount`
- `paymentId`
- `orderId`
- `status`
- `donorName`
- `donorEmail`
- `donorRole`
- `donorCollegeName`

## 8. API Reference

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Colleges

- `GET /api/colleges`

### Users

- `GET /api/users/profile`
- `PUT /api/users/profile`
- `GET /api/users`

### Campaigns

- `GET /api/campaigns`
- `GET /api/campaigns/:id`
- `POST /api/campaigns`
- `PUT /api/campaigns/:id`
- `DELETE /api/campaigns/:id`

### Donations

- `POST /api/donations/create-order`
- `POST /api/donations`
- `GET /api/donations/user`
- `GET /api/donations/all`
- `GET /api/donations/stats/admin`

## 9. Frontend Pages

### Public

- Home page
- Login
- Register
- Forgot password

### Protected

- Dashboard
- Campaign list
- Campaign details

### Admin Only

- Admin dashboard

## 10. Environment Variables

Create a root `.env` file:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_secret
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=your_secret
ADMIN_REGISTRATION_KEY=your_admin_key
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 11. Local Development

Install dependencies:

```bash
npm install
```

Run both apps:

```bash
npm run dev
```

Run separately:

```bash
npm run dev --workspace server
npm run dev --workspace client
```

## 12. Payment Flow

1. User opens a campaign
2. User selects donation amount
3. Frontend requests `/api/donations/create-order`
4. Backend creates Razorpay order
5. Razorpay checkout completes payment
6. Frontend sends payment details to `/api/donations`
7. Backend verifies signature
8. Donation is saved
9. Campaign total is updated

## 13. Security Notes

- Passwords are hashed before storage
- JWT protects authenticated routes
- Admin registration requires shared key
- College scoping prevents cross-college campaign access
- Payment verification uses Razorpay signature validation

## 14. Deployment Guide

### Backend

- Deploy `server` to Render or Railway
- Set all backend env variables
- Ensure MongoDB Atlas network access is allowed

### Frontend

- Deploy `client` to Vercel or Netlify
- Set `VITE_API_URL` to deployed backend `/api`

### Database

- Use MongoDB Atlas

## 15. Known Limitations

- Forgot-password currently returns a reset code directly instead of emailing it
- Campaign images currently use URLs instead of file storage
- Existing databases created before college scoping may need data migration

## 16. Recommended Enhancements

- Add email delivery for password reset and donation receipts
- Add cloud storage for campaign images
- Add analytics charts on admin dashboard
- Add comment threads on campaigns
- Add top donor leaderboard
- Add audit logs for admin actions

## 17. Important Files

### Backend

- `server/src/index.js`
- `server/src/controllers/authController.js`
- `server/src/controllers/campaignController.js`
- `server/src/controllers/donationController.js`
- `server/src/controllers/userController.js`
- `server/src/models/User.js`
- `server/src/models/College.js`
- `server/src/models/Campaign.js`
- `server/src/models/Donation.js`

### Frontend

- `client/src/App.jsx`
- `client/src/context/AuthContext.jsx`
- `client/src/api/axios.js`
- `client/src/pages/HomePage.jsx`
- `client/src/pages/CampaignListPage.jsx`
- `client/src/pages/CampaignDetailsPage.jsx`
- `client/src/pages/DashboardPage.jsx`
- `client/src/pages/AdminPage.jsx`
- `client/src/pages/AuthPage.jsx`
- `client/src/pages/ForgotPasswordPage.jsx`

## 18. Summary

Project Almgiver is a launch-ready, college-specific fundraising platform built for secure alumni giving, student visibility, and private institutional campaign management. The codebase is structured as a full-stack monorepo with clear separation between frontend UI, backend API logic, and MongoDB data models.

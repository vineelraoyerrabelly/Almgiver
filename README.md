# Almgiver

Almgiver is a full-stack alumni fundraising web application built with React, Vite, Tailwind CSS, Express, MongoDB, JWT authentication, and Razorpay test payments.

## Features

- Alumni and admin authentication with JWT and hashed passwords
- Campaign browsing, search, filtering, progress tracking, and campaign detail pages
- Razorpay test-mode donation checkout with donation history tracking
- Alumni dashboard for profile updates and donation history
- Admin dashboard for campaign CRUD, donation visibility, user management, and fundraising stats
- Responsive Tailwind UI with loading states, toasts, and error handling

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router, React Hot Toast
- Backend: Node.js, Express, Mongoose, JWT, bcryptjs, Razorpay
- Database: MongoDB Atlas
- Deployment: Frontend on Vercel or Netlify, backend on Render or Railway

## Project Structure

```text
almgiver/
  client/
  server/
  .env.example
  README.md
```

## Environment Variables

Copy the root `.env.example` into `server/.env` or root `.env` depending on your deployment setup.

```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_secret
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret
```

For the frontend, create `client/.env`:

```bash
VITE_API_URL=http://localhost:5000/api
```

If you want to allow admin self-registration from the UI, also set:

```bash
ADMIN_REGISTRATION_KEY=shared_bootstrap_key
```

Users only become admins when the registration form includes the matching key.

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start both apps from the repo root:

```bash
npm run dev
```

3. Or start them separately:

```bash
npm run dev --workspace server
npm run dev --workspace client
```

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Users

- `GET /api/users/profile`
- `PUT /api/users/profile`
- `GET /api/users` admin only

### Campaigns

- `GET /api/campaigns`
- `GET /api/campaigns/:id`
- `POST /api/campaigns` admin only
- `PUT /api/campaigns/:id` admin only
- `DELETE /api/campaigns/:id` admin only

### Donations

- `POST /api/donations/create-order`
- `POST /api/donations`
- `GET /api/donations/user`
- `GET /api/donations/all` admin only
- `GET /api/donations/stats/admin` admin only

## Deployment

### Backend on Render or Railway

1. Create a new web service from the `server` directory.
2. Add the environment variables from `.env.example`.
3. Set the start command to `npm start`.
4. Add your MongoDB Atlas connection string and Razorpay test credentials.

### Frontend on Vercel or Netlify

1. Deploy the `client` directory.
2. Set `VITE_API_URL` to your deployed backend URL plus `/api`.
3. Redeploy after the environment variable is saved.

## Razorpay Setup

1. Create a Razorpay account and switch to test mode.
2. Copy the key ID and secret into your backend environment variables.
3. Use the generated checkout on the campaign details page to test donations.

## Recommended Next Steps

- Add image uploads with Cloudinary or S3 instead of plain image URLs
- Add email receipts after successful donations
- Seed demo data for quicker QA
- Add charts and audit logs for deeper admin reporting

## GitHub

The repository is initialized locally. Pushing to GitHub still requires your Git remote and authentication. After adding a remote:

```bash
git add .
git commit -m "Build Almgiver fundraising platform"
git remote add origin <your-github-url>
git push -u origin main
```

## Screenshots

Add deployed screenshots after running locally or after deployment so the README reflects your final environment.
# Almgiver

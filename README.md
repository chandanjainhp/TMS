# Teacher Management System (TMS)

The Teacher Management System (TMS) is a web application designed for teachers to manage student marks effectively. This system prioritizes concurrency control to ensure smooth operation and data integrity.

## Features

- User authentication and authorization
- Student management
- Teacher management
- Form submissions and records
- Email notifications
- Data export (CSV, PDF)
- Admin dashboard

## Technology Stack

- **Frontend**: React, Material UI, Zustand, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT

## Project Structure

```
TMS/
├── client/             # React frontend
├── server/             # Express backend
├── .env                # Development environment variables
├── .env.production     # Production environment variables
└── package.json        # Root package.json for scripts
```

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm run install-all
   ```
3. Configure environment variables:
   - Create `.env` file in the root directory
   - Set up MongoDB connection string
   - Configure email credentials

4. Start development servers:
   ```
   npm run dev
   ```

## Production Deployment

### Prerequisites

- Node.js (v14+)
- MongoDB instance
- Email service account

### Build and Deploy

1. Configure production environment variables:
   - Update `.env.production` with your production settings
   - Set `NODE_ENV=production`
   - Configure MongoDB production URI
   - Set up email credentials

2. Build the client:
   ```
   npm run build
   ```

3. Start the production server:
   ```
   npm run prod
   ```

### Deployment Options

#### Option 1: Traditional Server

1. Transfer the built files to your server
2. Install dependencies: `npm install --production`
3. Start the server: `npm run prod`

## Environment Variables

### Required Variables

- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token generation
- `EMAIL_USER`: Email for sending notifications
- `EMAIL_PASS`: Email password or app-specific password

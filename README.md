# TMS - Teacher Management System

client/public/logo.png

A modern, full-stack web application for managing teachers, students, and educational records with role-based access control and comprehensive administrative features.

---

## 🚀 Features

### 👥 User Management
- **Multi-Role Authentication**: Users, Teachers, and Admins
- **Email Verification**: Secure account creation with email verification
- **Password Reset**: OTP-based password reset system (15 min expiry)
- **Session Management**: Auto-logout after inactivity (30 min for users, 15 min for admins)
- **Profile Settings**: Update profile information and change passwords

### 📊 Student Records
- **CSV Upload**: Bulk import student data via CSV files
- **Record Management**: View, edit, and delete student records
- **Search & Filter**: Advanced filtering and search capabilities
- **Data Export**: Export records in various formats

### 👨‍🏫 Teacher Features
- **Form Submission**: Submit and manage educational forms
- **Form Data Management**: Track and edit submitted forms
- **Teacher Logs**: Activity tracking and logging system
- **Dashboard**: Personalized teacher dashboard

### 🔐 Admin Panel
- **Admin Dashboard**: Comprehensive overview of system metrics
- **User Management**: Manage teachers and user accounts
- **Records Overview**: Access to all system records
- **Teacher Log Monitoring**: Track teacher activities
- **Admin Settings**: System configuration and management
- **Separate Admin Authentication**: Dedicated admin login system

### 🎨 Modern UI/UX
- **Gradient Theme**: Beautiful indigo → purple → pink gradient design
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Smooth Animations**: Framer Motion animations throughout
- **Toast Notifications**: Real-time user feedback with react-hot-toast
- **Header Navigation**: Clean, intuitive navigation system

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Nodemailer** - Email sending
- **Cookie Parser** - Cookie handling
- **CORS** - Cross-origin resource sharing

---

## 📁 Project Structure

```
TMS/
├── client/                    # Frontend React application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── assets/          # Images, icons
│   │   ├── components/      # React components
│   │   │   ├── admin/      # Admin-specific components
│   │   │   ├── common/     # Shared components (Header, etc.)
│   │   │   ├── editing/    # Edit functionality components
│   │   │   ├── form/       # Form components
│   │   │   ├── landing/    # Landing page components
│   │   │   ├── login/      # Authentication components
│   │   │   ├── records/    # Record management components
│   │   │   ├── settings/   # Settings components
│   │   │   ├── student/    # Student-related components
│   │   │   ├── teacher/    # Teacher-specific components
│   │   │   └── teacherlog/ # Teacher log components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # Zustand state stores
│   │   │   ├── authStore.js       # User authentication
│   │   │   ├── adminAuthStore.js  # Admin authentication
│   │   │   └── studentStore.js    # Student data
│   │   ├── styles/         # Global styles
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                   # Backend Node.js application
│   ├── config/              # Configuration files
│   ├── controllers/         # Route controllers
│   │   ├── auth.controller.js
│   │   ├── EditingStudentController.js
│   │   ├── from.controller.js
│   │   ├── student.controller.js
│   │   ├── user.controller.js
│   │   └── userActivity.controller.js
│   ├── db/                  # Database connection
│   │   └── connectDB.js
│   ├── email/               # Email templates and configuration
│   │   ├── email.config.js
│   │   ├── emails.js
│   │   ├── emailTemplates.js
│   │   └── testEmail.js
│   ├── middleware/          # Express middleware
│   │   ├── authMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── verifyToken.js
│   ├── models/              # Mongoose models
│   │   ├── EditingStudent.model.js
│   │   ├── form.models.js
│   │   ├── Student.model.js
│   │   ├── user.model.js
│   │   └── userActivity.model.js
│   ├── routes/              # API routes
│   │   ├── admin.auth.route.js
│   │   ├── auth.route.js
│   │   ├── EditingStudentRoutes.js
│   │   ├── formRoutes.js
│   │   ├── passwordReset.js
│   │   ├── studentRoutes.js
│   │   ├── user.route.js
│   │   ├── user.routes.js
│   │   └── userActivity.routes.js
│   ├── scripts/             # Utility scripts
│   │   ├── createAdmin.js
│   │   ├── findAdmins.js
│   │   ├── makeAdmin.js
│   │   ├── resetAdminPassword.js
│   │   └── setupBackupAdmin.js
│   ├── services/            # Business logic services
│   ├── Student/             # Student-related utilities
│   ├── uploads/             # File upload directory
│   ├── utils/               # Utility functions
│   │   └── generateTokenAndSetCookie.js
│   ├── index.js             # Server entry point
│   └── package.json
│
├── student_data.csv         # Sample CSV data
├── docker-compose.yaml      # Docker Compose configuration
├── .gitignore
├── package.json
└── README.md
```

---

## 🔧 Installation & Setup

### 1. Using Docker (Recommended)

1. Ensure Docker and Docker Compose are installed.
2. Run the application:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`
   - MongoDB: `mongodb://localhost:27017`

### 2. Manual Installation

### Prerequisites
- **Node.js** (v18 or higher) or **Bun**
- **MongoDB** (local or MongoDB Atlas)
- **npm**, **yarn**, or **bun**

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/TMS.git
cd TMS
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
bun install
# or
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your configuration
# For Docker, this is handled automatically
```

**Required Environment Variables:**
```env
# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/TMS

# Server
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Email Configuration (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=TMS <your-email@gmail.com>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
```

### 3. Frontend Setup

```bash
# Navigate to client directory
cd ../client

# Install dependencies
bun install
# or
npm install

# Start development server
bun run dev
# or
npm run dev
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
bun run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
bun run dev
```

### 5. Create Admin Account

```bash
cd server
node scripts/setupBackupAdmin.js
```

**Default Admin Credentials:**
- Email: `backupid849@gmail.com`
- Password: `BackupAdmin@123`

---

## 🌐 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/signup` | Register new user | Public |
| POST | `/login` | User login | Public |
| POST | `/logout` | User logout | Private |
| POST | `/verify-email` | Verify email with code | Public |
| POST | `/forgot-password` | Request password reset OTP | Public |
| POST | `/reset-password` | Reset password with OTP | Public |
| POST | `/change-password` | Change password | Private |
| GET | `/check-auth` | Verify authentication | Private |

### Admin Authentication Routes (`/api/admin/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/login` | Admin login | Public |
| POST | `/logout` | Admin logout | Private |
| GET | `/check-auth` | Verify admin authentication | Private |
| POST | `/admin/forgot-password` | Admin password reset OTP | Public |
| POST | `/admin/reset-password-otp` | Reset admin password | Public |

### Student Routes (`/api/students`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all students | Private |
| POST | `/` | Create new student | Private |
| PUT | `/:id` | Update student | Private |
| DELETE | `/:id` | Delete student | Private |
| POST | `/upload` | Upload CSV file | Private |

### Form Routes (`/api/form`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all forms | Private |
| POST | `/` | Create new form | Private |
| PUT | `/:id` | Update form | Private |
| DELETE | `/:id` | Delete form | Private |

### User Activity Routes (`/api/user-activity`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get user activities | Admin |
| POST | `/` | Log user activity | Private |

---

## 🎨 Design System

### Color Palette

```css
/* Primary Gradient */
--gradient-primary: linear-gradient(135deg, #4f46e5 0%, #9333ea 50%, #ec4899 100%);

/* Background Gradient */
--gradient-bg: linear-gradient(to bottom right, 
  rgb(238 242 255), rgb(243 232 255), rgb(252 231 243));

/* Text Colors */
--text-primary: #111827;
--text-secondary: #6b7280;
--text-light: #9ca3af;

/* Status Colors */
--success: #10b981;
--error: #ef4444;
--warning: #f59e0b;
--info: #3b82f6;
```

### Typography
- **Font Family**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Headings**: Bold, gradient text
- **Body**: Regular, dark gray

### Components
- **Buttons**: Gradient background with hover effects
- **Inputs**: Bordered with icons
- **Cards**: White background with shadow
- **Modals**: Centered with backdrop
- **Toast**: Top-right notifications

---

## 🔐 Authentication Flow

### User Registration
```
1. User submits email, password, name
2. Server validates input
3. Password hashed with bcryptjs
4. Verification code generated (6-digit)
5. Verification email sent
6. User record created (isVerified: false)
7. JWT token set in cookie
8. Redirect to verification page
```

### Email Verification
```
1. User receives 6-digit code via email
2. User enters code on verification page
3. Server validates code
4. User.isVerified set to true
5. Welcome email sent
6. Redirect to dashboard
```

### Password Reset (OTP-based)
```
1. User enters email on forgot password page
2. Server generates 6-digit OTP
3. OTP saved with 15-minute expiry
4. OTP sent via email
5. User enters OTP and new password
6. Server validates OTP and expiry
7. Password updated
8. Success email sent
9. Redirect to login
```

### Session Management
```
1. JWT token stored in httpOnly cookie
2. Token verified on protected routes
3. Auto-logout after inactivity:
   - Regular users: 30 minutes
   - Admin users: 15 minutes
4. Activity tracking resets timeout
5. Manual logout clears cookie and session
```

---

## 📧 Email Templates

### Available Templates
1. **Verification Email** - Account email verification
2. **Welcome Email** - Sent after successful verification
3. **Password Reset OTP** - Password reset with OTP code
4. **Admin Password Reset OTP** - Admin-specific password reset
5. **Reset Success** - Password reset confirmation

### Email Configuration
- **Provider**: Gmail SMTP
- **Port**: 465 (SSL)
- **Host**: smtp.gmail.com
- **From**: TMS System

### Email Features
- Beautiful gradient-themed HTML templates
- Responsive design
- Security warnings
- Expiration notices
- Support contact information

---

## 🛡️ Security Features

### Authentication
- ✅ JWT-based authentication
- ✅ httpOnly cookies (prevents XSS)
- ✅ Password hashing (bcryptjs)
- ✅ Email verification required
- ✅ OTP-based password reset (15 min expiry)
- ✅ Separate admin authentication

### Authorization
- ✅ Role-based access control (User, Teacher, Admin)
- ✅ Protected routes with middleware
- ✅ Admin-only endpoints
- ✅ Token verification on each request

### Session Security
- ✅ Auto-logout on inactivity
- ✅ Session timeout (30 min users, 15 min admins)
- ✅ Activity tracking
- ✅ Secure cookie settings

### Data Protection
- ✅ Input validation
- ✅ SQL injection prevention (Mongoose)
- ✅ XSS protection
- ✅ CORS configuration
- ✅ Environment variables for secrets

---

## 📱 Routes & Pages

### Public Routes
- `/` - Landing Page
- `/login` - User Login
- `/signup` - User Registration
- `/verify-email` - Email Verification
- `/forgot-password` - Request Password Reset
- `/reset-password` - Reset Password with OTP
- `/admin-login` - Admin Login
- `/admin/forgot-password` - Admin Password Reset Request
- `/admin/reset-password-otp` - Admin Password Reset with OTP

### Protected Routes (User)
- `/settings` - User Settings & Profile
- `/upload` - Upload Student Data (CSV)
- `/form-data` - View Form Submissions
- `/from` - Submit New Form
- `/records` - View Student Records

### Protected Routes (Admin)
- `/admin/dashboard` - Admin Dashboard
- `/admin/records` - All Student Records
- `/admin/teacher-log` - Teacher Activity Logs
- `/admin/settings` - Admin Settings

---

## 🧪 Testing

### Run Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

### Manual Testing Checklist

#### Authentication
- [ ] User registration with email verification
- [ ] User login with valid credentials
- [ ] Password reset with OTP
- [ ] Admin login
- [ ] Session timeout (30 min for users, 15 min for admins)
- [ ] Auto-logout on inactivity

#### Student Management
- [ ] Upload CSV file
- [ ] View student records
- [ ] Edit student record
- [ ] Delete student record
- [ ] Search and filter students

#### Form Management
- [ ] Submit new form
- [ ] View submitted forms
- [ ] Edit form data
- [ ] Delete form

#### Admin Features
- [ ] Access admin dashboard
- [ ] View all records
- [ ] Monitor teacher logs
- [ ] Admin settings management

---

## 🚀 Deployment

### Backend Deployment (Node.js)

**Option 1: Heroku**
```bash
# Login to Heroku
heroku login

# Create app
heroku create tms-backend

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
# ... set other env variables

# Deploy
git push heroku main
```

**Option 2: DigitalOcean/AWS/Azure**
1. Set up Node.js server
2. Install PM2 for process management
3. Configure Nginx reverse proxy
4. Set up SSL certificate
5. Deploy code and run with PM2

### Frontend Deployment (React)

**Option 1: Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd client
vercel
```

**Option 2: Netlify**
1. Build the project: `npm run build`
2. Drag and drop `dist` folder to Netlify
3. Configure environment variables

### Database
- Use MongoDB Atlas for cloud database
- Or set up MongoDB on your server

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Use ES6+ syntax
- Follow Airbnb style guide
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors

- **Your Name** - *Initial work* - [GitHub Profile](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS
- Framer Motion for smooth animations
- MongoDB for the flexible database
- Express.js for the robust backend framework
- All contributors and testers

---

## 📞 Support

For support, email backupid849@gmail.com or open an issue in the GitHub repository.

---

## 📊 Project Status

**Current Version**: 1.0.0

**Status**: ✅ Production Ready

### Recent Updates
- ✅ Header navigation system implemented
- ✅ Email templates with gradient theme
- ✅ OTP-based password reset (users & admins)
- ✅ Session timeout feature (30 min users, 15 min admins)
- ✅ Activity tracking for session management
- ✅ Admin authentication system
- ✅ Admin settings page
- ✅ Separate admin and user flows

### Roadmap
- [ ] Two-factor authentication
- [ ] Advanced analytics dashboard
- [ ] Export to PDF functionality
- [ ] Bulk user management
- [ ] Email notification preferences
- [ ] Dark mode support
- [ ] Mobile app (React Native)



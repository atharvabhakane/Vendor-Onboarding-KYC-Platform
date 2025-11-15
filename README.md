# Smart Vendor Onboarding & KYC Platform

A comprehensive full-stack application for managing vendor onboarding and KYC (Know Your Customer) processes with role-based authentication and document management.

## 🚀 Features

### Core Functionality
- **Vendor Registration**: Complete registration form with business details
- **Document Upload**: Drag-and-drop file uploads for KYC documents (GST, PAN, Registration Certificate)
- **Admin Review System**: Comprehensive dashboard for reviewing and approving/rejecting vendors
- **Status Tracking**: Real-time status updates (Pending → Approved/Rejected)
- **Role-Based Access**: Separate dashboards for Vendors and Admins
- **Status History**: Complete audit trail of all status changes

### Technical Features
- JWT-based authentication
- File upload with validation (PDF, JPG, PNG - max 5MB)
- RESTful API architecture
- Responsive design for mobile and desktop
- Real-time notifications
- Search and filter functionality
- Auto-generated vendor IDs

## 🛠️ Tech Stack

### Frontend
- **React 18+** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router v6** - Routing
- **Axios** - API calls
- **React Hook Form** - Form handling
- **React Dropzone** - File uploads
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File upload middleware
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (v5 or higher)
- **npm** or **yarn**

## 🔧 Installation & Setup

### 1. Clone or Navigate to Project Directory

```bash
cd C:\Users\Samarth\OneDrive\Desktop\Vendor
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (already created with these values)
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/vendor-kyc
# JWT_SECRET=hackathon_secret_2024
# NODE_ENV=development

# Make sure MongoDB is running on your system
# For Windows: Start MongoDB service
# For Mac/Linux: sudo systemctl start mongod

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:3000`

## 🎯 Usage

### Mock User Credentials

The application uses mock authentication for hackathon purposes (no password required):

#### Vendor Login
- **Email**: `vendor@test.com`
- **Role**: Vendor

#### Admin Login
- **Email**: `admin@test.com`
- **Role**: Admin

### Workflow

1. **Login**: Select role (Vendor/Admin) and click Login
2. **Vendor Flow**:
   - First-time login → Redirected to Registration page
   - Fill out business information, contact details, and address
   - Submit registration
   - Upload KYC documents (GST, PAN, etc.)
   - View application status on dashboard
   
3. **Admin Flow**:
   - View dashboard with statistics
   - Browse all vendor applications
   - Filter by status and search
   - Click "View" to see vendor details
   - Approve or Reject applications
   - Add rejection reason when rejecting

## 📁 Project Structure

```
vendor-kyc-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   └── Vendor.js            # Vendor schema
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js    # JWT verification
│   │   │   ├── roleMiddleware.js    # Role-based access
│   │   │   └── uploadMiddleware.js  # File upload config
│   │   ├── controllers/
│   │   │   ├── authController.js    # Authentication logic
│   │   │   ├── vendorController.js  # Vendor operations
│   │   │   └── adminController.js   # Admin operations
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # Auth endpoints
│   │   │   ├── vendorRoutes.js      # Vendor endpoints
│   │   │   └── adminRoutes.js       # Admin endpoints
│   │   └── server.js                # Express app setup
│   ├── uploads/                     # Uploaded documents
│   ├── .env                         # Environment variables
│   ├── .gitignore
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   │   └── LoginForm.jsx
    │   │   ├── vendor/
    │   │   │   ├── RegistrationForm.jsx
    │   │   │   ├── DocumentUpload.jsx
    │   │   │   └── VendorDashboard.jsx
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── VendorList.jsx
    │   │   │   ├── VendorDetails.jsx
    │   │   │   └── ApprovalActions.jsx
    │   │   └── common/
    │   │       ├── Navbar.jsx
    │   │       ├── StatusBadge.jsx
    │   │       └── LoadingSpinner.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── VendorRegistration.jsx
    │   │   ├── VendorDashboardPage.jsx
    │   │   └── AdminDashboardPage.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   └── authService.js
    │   ├── utils/
    │   │   └── constants.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .gitignore
    └── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Vendor Routes (Protected - Vendor Role)
- `POST /api/vendors/register` - Register new vendor
- `GET /api/vendors/profile` - Get vendor profile
- `POST /api/vendors/:id/documents` - Upload document
- `DELETE /api/vendors/:id/documents/:documentId` - Delete document
- `PUT /api/vendors/:id` - Update vendor details

### Admin Routes (Protected - Admin Role)
- `GET /api/admin/vendors` - Get all vendors (with filters)
- `GET /api/admin/vendors/:id` - Get specific vendor
- `PUT /api/admin/vendors/:id/status` - Update vendor status
- `GET /api/admin/stats` - Get dashboard statistics

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  userId: Number,
  name: String,
  email: String,
  role: String, // "vendor" or "admin"
  createdAt: Date
}
```

### Vendors Collection
```javascript
{
  _id: ObjectId,
  vendorId: String, // Auto-generated: "VEN-00001"
  userId: ObjectId, // Reference to Users
  businessName: String,
  businessType: String,
  contactPerson: String,
  email: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  documents: [{
    documentType: String,
    fileName: String,
    fileUrl: String,
    uploadedAt: Date
  }],
  status: String, // "Pending", "Approved", "Rejected"
  submittedAt: Date,
  reviewedAt: Date,
  reviewedBy: ObjectId,
  rejectionReason: String,
  statusHistory: [{
    status: String,
    changedBy: ObjectId,
    changedAt: Date,
    comment: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Color Scheme

- **Primary**: Blue (#2563eb)
- **Success**: Green (#16a34a)
- **Warning**: Yellow (#eab308)
- **Danger**: Red (#dc2626)
- **Background**: Gray (#f9fafb)

## ✅ Testing Checklist

- [x] Vendor can register successfully
- [x] Vendor can upload multiple documents
- [x] Vendor can view their application status
- [x] Admin can see all vendor applications
- [x] Admin can filter vendors by status
- [x] Admin can search vendors
- [x] Admin can approve vendors
- [x] Admin can reject vendors with reason
- [x] Status updates are reflected immediately
- [x] Status history is maintained
- [x] All forms have proper validation
- [x] File upload works correctly
- [x] Authentication and authorization work
- [x] UI is responsive on mobile and desktop

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Make sure MongoDB is running
# Windows:
net start MongoDB

# Mac/Linux:
sudo systemctl start mongod
```

### Port Already in Use
```bash
# If port 5000 or 3000 is already in use, change in:
# Backend: .env file (PORT=5001)
# Frontend: vite.config.js (port: 3001)
```

### CORS Issues
- Make sure both frontend and backend are running
- Check that the API base URL in frontend matches backend URL

## 🚀 Deployment

### Backend Deployment (e.g., Heroku, Railway, Render)
1. Set environment variables
2. Update MONGODB_URI to production database
3. Deploy backend code

### Frontend Deployment (e.g., Vercel, Netlify)
1. Update API base URL to production backend URL
2. Run `npm run build`
3. Deploy the `dist` folder

## 📝 Notes

- This project uses mock authentication (no password) for hackathon purposes
- File uploads are stored locally in `backend/uploads/`
- For production, consider using cloud storage (AWS S3, Cloudinary)
- Implement proper password hashing (bcrypt) for production
- Add email notifications for status updates
- Implement pagination for large datasets

## 👥 Team Members

- Your Name / Team Name Here

## 📄 License

MIT License - Feel free to use this project for your hackathon or learning purposes.

## 🙏 Acknowledgments

Built for hackathon demonstration purposes. Showcases full-stack development skills with modern web technologies.

---

**Happy Coding! 🎉**


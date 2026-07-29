# Portfolio Dashboard

A database-driven portfolio management system with an admin dashboard for managing all content. Transform your hardcoded JSON portfolio into a dynamic system with full CRUD capabilities.

## 🚀 Features

### Current Features
- **Authentication System**
  - User registration and login
  - JWT token-based authentication
  - Protected routes and API endpoints
  - Redux state management with RTK Query
  - Password hashing with bcryptjs

### Planned Features
- Profile management
- Section management (experience, skills, education, etc.)
- Content item management
- File upload system (images, media, logos)
- Multi-language support
- Category management
- Dashboard analytics

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **RTK Query** - Data fetching and caching
- **React Router** - Routing
- **Custom CSS** - Styling with portfolio theme

## 📁 Project Structure

```
portFolioApi/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   └── authController.js    # Authentication logic
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   └── User.js              # User model
│   ├── routes/
│   │   └── auth.js              # Authentication routes
│   ├── server.js               # Express server entry point
│   ├── package.json
│   └── .env                    # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── auth/
│   │   │       ├── SignupForm.jsx
│   │   │       ├── SigninForm.jsx
│   │   │       └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   ├── api.js          # RTK Query base configuration
│   │   │   └── authApi.js      # Authentication API
│   │   ├── store/
│   │   │   ├── authSlice.js    # Auth state management
│   │   │   └── index.js        # Redux store configuration
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css           # Custom CSS with portfolio theme
│   ├── package.json
│   └── .env                    # Environment variables
├── DASHBOARD_ARCHITECTURE.md   # Detailed architecture documentation
├── .gitignore
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portFolioApi
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Setup MongoDB**
   - Make sure MongoDB is running locally
   - Or update the `MONGODB_URI` in `backend/.env` for MongoDB Atlas

5. **Configure environment variables**

   **Backend (`backend/.env`):**
   ```env
   NODE_ENV=development
   PORT=5000
   
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/portfolio_dashboard
   DB_NAME=portfolio_dashboard
   
   # JWT
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   
   # CORS
   CORS_ORIGIN=http://localhost:5173
   ```

   **Frontend (`frontend/.env`):**
   ```env
   VITE_API_URL=http://localhost:5000
   ```

## 🏃 Running the Application

### Start Backend
```bash
cd backend
npm start          # Production mode
npm run dev        # Development mode with nodemon
```

### Start Frontend
```bash
cd frontend
npm run dev        # Development mode
npm run build      # Production build
```

### Access the Application
- **Frontend**: http://localhost:5173 (or the port shown by Vite)
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🔐 API Endpoints

### Authentication

#### POST /api/auth/signup
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/signin
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Get current user (Protected - requires JWT token)

## 🎨 Styling

The application uses a custom CSS implementation with the portfolio dark theme:

- **Primary Color**: #9dff8e (green accent)
- **Background**: #0c0c0c (main), #191919 (containers)
- **Text**: #EEEEEE (primary), #a4afb5 (secondary)
- **Typography**: Orbitron (headings), Saira (body)
- **Custom Components**: All utility classes manually implemented

## 🔧 Development Workflow

### Adding New Features

1. **Backend:**
   - Create models in `backend/models/`
   - Create controllers in `backend/controllers/`
   - Create routes in `backend/routes/`
   - Update `backend/server.js` to include new routes

2. **Frontend:**
   - Create API slices in `frontend/src/services/`
   - Create components in `frontend/src/components/`
   - Create pages in `frontend/src/pages/`
   - Update Redux store if needed
   - Add routes in `frontend/src/App.jsx`

### Code Style

- Use functional components with React hooks
- Follow existing folder structure
- Use descriptive variable and function names
- Add comments for complex logic
- Follow the existing CSS utility class pattern

## 📝 Environment Variables

### Backend Variables
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `DB_NAME` - Database name
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - Token expiration time
- `CORS_ORIGIN` - Allowed CORS origin

### Frontend Variables
- `VITE_API_URL` - Backend API URL

## 🧪 Testing

### Manual Testing

1. **Test Authentication:**
   - Navigate to `/signup` and create a new account
   - Verify you can login with the credentials
   - Check that protected routes redirect to login when not authenticated
   - Verify JWT token is stored in localStorage

2. **Test API:**
   - Use Postman or similar tool to test API endpoints
   - Verify JWT authentication works on protected routes
   - Test input validation on signup/signin

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in environment variables
2. Use a production MongoDB instance
3. Set a strong `JWT_SECRET`
4. Deploy to your preferred hosting (Heroku, AWS, DigitalOcean, etc.)

### Frontend Deployment
1. Run `npm run build` to create production build
2. Deploy the `dist` folder to Vercel, Netlify, or similar
3. Update `VITE_API_URL` to production backend URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Architecture based on the portfolio dashboard system design
- Portfolio theme colors and styling from the original portfolio design

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

**Note**: This project is currently in active development. Features are being added incrementally following the architecture documented in `DASHBOARD_ARCHITECTURE.md`.
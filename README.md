# Application Boilerplate

A fully functional web application boilerplate with user authentication and account management features.

## Features

- User authentication (login/register)
- JWT token-based sessions
- User roles (admin/regular)
- Responsive layout with mobile support
- Admin dashboard
- Ready to extend with your custom features

## Tech Stack

- **Frontend**: Next.js (React)
- **Backend**: Flask (Python)
- **Database**: PostgreSQL
- **Authentication**: JWT

## Project Structure

```
application-boilerplate/
├── frontend/               # Next.js frontend application
├── backend/                # Flask backend application
└── docs/                   # Documentation
```

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- PostgreSQL
- npm or yarn

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
flask run
```

### Database Setup
```bash
# In the backend directory with venv activated
python init_db.py
```

## Deployment

### Complete Deployment Guide

For a full-stack application to work properly, you need to deploy both the frontend and backend:

1. **Frontend**: Deploy to GitHub Pages (static hosting)
2. **Backend**: Deploy to a platform that supports Python/Flask (Render, Railway, Heroku, etc.)
3. **Connect**: Configure the frontend to communicate with your deployed backend

### GitHub Pages Deployment (Frontend Only)

This project is configured to deploy the frontend to GitHub Pages using GitHub Actions:

1. Push your code to GitHub
2. Go to your repository settings and enable GitHub Pages
   - Navigate to Settings > Pages
   - Under "Build and deployment", select "GitHub Actions" as the source
3. The frontend will be automatically deployed when you push to the main branch
4. Your site will be available at `https://[username].github.io/[repository-name]`

### Backend Deployment

Since GitHub Pages only hosts static content, you need to deploy your backend separately:

1. Choose a hosting platform that supports Python/Flask applications (Render, Railway, Heroku, etc.)
2. Deploy your backend code to the platform
3. Configure environment variables and database connections
4. Run the database initialization script to create the admin user

### Connecting Frontend to Backend

After deploying both parts:

1. Go to your GitHub repository settings
2. Navigate to Settings > Secrets and variables > Actions
3. Add a new repository secret:
   - Name: `API_URL`
   - Value: Your backend API URL (e.g., `https://your-backend-api.com/api`)
4. Trigger a new deployment of your frontend

## Admin Access

The default admin credentials (set in `init_db.py`) are:
- Email: `admin@example.com`
- Password: `adminpassword`

Make sure your backend is properly deployed and the database is initialized before attempting to log in.

## Extending the Boilerplate

This boilerplate provides a solid foundation for building web applications. To extend it:

1. Add new models to `backend/app/models/`
2. Create new API endpoints in `backend/app/api/`
3. Add new pages to `frontend/pages/`
4. Extend the UI components in `frontend/components/`

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
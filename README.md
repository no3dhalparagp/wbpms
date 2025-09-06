# Next.js 15 Multi-Database Role-Based Authentication System

A comprehensive Next.js 15 application with Google OAuth authentication and role-based access control using multiple MongoDB Atlas databases - one for each user.

## 🏗️ Architecture Overview

This system implements a unique multi-database architecture where:
- **Master Database**: Stores user authentication data, role information, and database configurations
- **User Databases**: Each user gets their own MongoDB Atlas database for complete data isolation
- **Role-Based Access**: Three-tier system (Staff, Admin, Super Admin) with appropriate permissions

## 🚀 Features

### Authentication & Authorization
- **Google OAuth Integration** via NextAuth.js
- **Role-Based Access Control** (RBAC) with three levels:
  - **Staff**: Basic access to personal dashboard and profile
  - **Admin**: User management for Staff and Admin users
  - **Super Admin**: Complete system control and user management

### Multi-Database System
- **Database Isolation**: Each user gets their own MongoDB Atlas database
- **Connection Pooling**: Intelligent connection management with cleanup
- **Master Database**: Centralized user management and database configurations
- **Dynamic Routing**: Automatic database selection based on user context

### Security Features
- **Route Protection**: Middleware-based route protection
- **Role Guards**: Client and server-side role validation
- **Session Management**: Secure session handling with database storage
- **Environment Isolation**: Separate database credentials per user

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB Atlas accounts (multiple for user isolation)
- Google OAuth credentials
- Vercel account (for deployment)

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies

\`\`\`bash
git clone <repository-url>
cd nextjs-multi-db-auth
npm install
\`\`\`

### 2. Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`env
# Master Database (for user lookup and database configurations)
MASTER_DATABASE_URL="mongodb+srv://username:password@master-cluster.mongodb.net/master?retryWrites=true&w=majority"
DATABASE_URL="mongodb+srv://username:password@master-cluster.mongodb.net/master?retryWrites=true&w=majority"

# Default database URL for new users
DEFAULT_USER_DATABASE_URL="mongodb+srv://username:password@user-cluster.mongodb.net/userdb?retryWrites=true&w=majority"

# NextAuth.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Optional: User-specific database URLs
# DATABASE_URL_USER_123="mongodb+srv://user123:password@user123-cluster.mongodb.net/user123db"
\`\`\`

### 3. Database Setup

1. **Create MongoDB Atlas Clusters**:
   - Master cluster for user management
   - Default user cluster template
   - Additional clusters for user isolation (optional)

2. **Initialize Database Schema**:
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

3. **Seed Initial Data**:
\`\`\`bash
# Run the database initialization scripts
npm run db:init
\`\`\`

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the application.

## 🏛️ Project Structure

\`\`\`
├── app/
│   ├── actions/           # Server actions for database operations
│   ├── admin/            # Admin dashboard and user management
│   ├── api/auth/         # NextAuth.js API routes
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # General dashboard
│   ├── staff/            # Staff-specific pages
│   └── super-admin/      # Super admin controls
├── components/
│   ├── admin/            # Admin-specific components
│   ├── auth/             # Authentication components
│   ├── layout/           # Layout components
│   ├── super-admin/      # Super admin components
│   └── ui/               # Reusable UI components
├── lib/
│   ├── auth.ts           # NextAuth.js configuration
│   ├── auth-utils.ts     # Authentication utilities
│   ├── database-manager.ts # Database management utilities
│   ├── multi-prisma.ts   # Multi-database connection manager
│   └── prisma.ts         # Prisma client exports
├── prisma/
│   └── schema.prisma     # Database schema
└── scripts/              # Database initialization scripts
\`\`\`

## 🔐 Role-Based Access Control

### Staff Role
- Access to personal dashboard
- View own profile and settings
- Basic system information
- Cannot manage other users

### Admin Role  
- All Staff permissions
- Manage Staff and Admin users
- Promote Staff to Admin
- Activate/deactivate accounts
- Cannot create Super Admins
- Cannot modify Super Admin accounts

### Super Admin Role
- All Admin permissions
- Complete system control
- Manage all user roles including Super Admins
- System-wide statistics and monitoring
- Database configuration management

## 🗄️ Database Architecture

### Master Database Collections
- `users` - User authentication and role data
- `accounts` - OAuth account linkings
- `sessions` - User sessions
- `databaseConfigs` - User database configurations
- `verificationTokens` - Email verification tokens

### User Database Collections
- User-specific data and settings
- Application data isolated per user
- Custom collections based on user needs

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**:
\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

2. **Deploy to Vercel**:
   - Connect your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Update OAuth Redirect URIs**:
   - Add your Vercel domain to Google OAuth settings
   - Update `NEXTAUTH_URL` environment variable

### Environment Variables in Production
Ensure all environment variables are properly set in your deployment platform:
- Database connection strings
- OAuth credentials  
- NextAuth secret and URL
- Any user-specific database URLs

## 🔧 Customization

### Adding New Roles
1. Update the `Role` enum in `prisma/schema.prisma`
2. Add role checks in `lib/auth-utils.ts`
3. Create role-specific pages and components
4. Update middleware for route protection

### Adding User-Specific Features
1. Create new collections in user databases
2. Implement database operations using `getUserPrismaClient()`
3. Add UI components for the new features
4. Update role permissions as needed

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Verify MongoDB Atlas connection strings
   - Check network access settings in Atlas
   - Ensure proper authentication credentials

2. **OAuth Authentication Issues**:
   - Verify Google OAuth credentials
   - Check redirect URI configuration
   - Ensure proper domain settings

3. **Role Permission Errors**:
   - Check user role assignments in database
   - Verify middleware configuration
   - Review route protection settings

### Debug Mode
Enable debug logging by adding console.log statements with `[v0]` prefix:

\`\`\`typescript
console.log("[v0] User database connection:", databaseId)
\`\`\`

## 📚 API Reference

### Multi-Database Functions

\`\`\`typescript
// Get user's specific database client
const userClient = await getUserPrismaClient(userId)

// Get user database by email
const userClient = await getUserPrismaClientByEmail(email)

// Get master database client
const masterClient = await getMasterPrismaClient()
\`\`\`

### Authentication Utilities

\`\`\`typescript
// Require specific roles
await requireSuperAdmin()
await requireAdmin() 
await requireStaff()

// Check user permissions
const hasPermission = await checkUserRole(userId, 'ADMIN')
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- NextAuth.js for authentication
- Prisma for database management
- MongoDB Atlas for database hosting
- Vercel for deployment platform

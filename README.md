# 🏠 DormDash

A comprehensive residence management system built with Laravel and React, designed to streamline dormitory operations, student engagement, and administrative tasks.

## 📋 About

DormDash is a modern web application that provides a complete solution for managing student residences. It facilitates communication between students and administrators, manages room assignments, handles events and voting, and provides real-time messaging capabilities.

## ✨ Features

### Student Features
- **Dashboard**: Personalized student dashboard with residence overview
- **Room Management**: View room details, roommates, and room availability
- **Events**: Browse and RSVP to residence events
- **Voting Center**: Participate in residence-wide votes and polls
- **Notifications**: Receive and manage residence notifications
- **Messaging**: Real-time chat with other students and groups
- **Maintenance Requests**: Submit and track maintenance requests
- **Profile Management**: Update personal information and preferences

### Administrative Features
- **Residence Management**: Manage multiple residences, campuses, and rooms
- **User Management**: Create, update, and manage student accounts
- **Access Control**: Granular permission system with role-based access
- **Notification System**: Create and manage residence-wide notifications
- **Event Management**: Create and manage residence events
- **Voting Administration**: Create and manage voting polls
- **Maintenance Tracking**: Review and update maintenance request statuses
- **Analytics Dashboard**: View statistics on occupancy, applications, and revenue

## 🛠️ Tech Stack

### Backend
- **Framework**: Laravel 12
- **PHP**: 8.2+
- **Authentication**: Laravel Sanctum
- **Database**: MySQL (primary), MongoDB, Redis (cache)
- **Queue System**: Laravel Queue with Pusher integration
- **Real-time**: Laravel Broadcasting with Pusher

### Frontend
- **Framework**: React 18
- **Routing**: Inertia.js
- **Language**: TypeScript & JavaScript (JSX/TSX)
- **Styling**: Tailwind CSS, Bootstrap 5
- **UI Components**: Radix UI (shadcn/ui)
- **Build Tool**: Vite
- **State Management**: React Hooks

### Additional Tools
- **Excel Import/Export**: Maatwebsite Excel
- **Code Quality**: Laravel Pint
- **Testing**: PHPUnit
- **Containerization**: Docker (Laravel Sail)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- MySQL 8.0+
- Redis (optional, for caching)
- Docker & Docker Compose (optional, for Sail)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd DormDashInertia
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install JavaScript Dependencies

```bash
npm install
```

### 4. Environment Configuration

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` file with your database credentials and other configuration:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dormdash
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Pusher Configuration (for real-time features)
PUSHER_APP_ID=your_app_id
PUSHER_APP_KEY=your_app_key
PUSHER_APP_SECRET=your_app_secret
PUSHER_APP_CLUSTER=your_cluster
```

### 5. Database Setup

```bash
# Run migrations
php artisan migrate

# Seed the database with sample data
php artisan db:seed
```

### 6. Build Frontend Assets

```bash
# Development build
npm run dev

# Production build
npm run build
```

## 🏃 Running the Application

### Development Mode (Recommended)

Start all services at once:

```bash
composer dev
```

This command starts:
- Laravel development server (http://localhost:8000)
- Vite dev server with HMR
- Queue worker
- Log viewer (Pail)

### Individual Services

```bash
# Laravel server
php artisan serve

# Vite dev server
npm run dev

# Queue worker
php artisan queue:listen

# Log viewer
php artisan pail
```

### Using Docker (Laravel Sail)

```bash
# Start containers
./vendor/bin/sail up

# Stop containers
./vendor/bin/sail down
```

## 📁 Project Structure

```
DormDashInertia/
├── app/
│   ├── Events/              # Event classes
│   ├── Http/
│   │   ├── Controllers/     # Application controllers
│   │   ├── Middleware/      # Custom middleware
│   │   └── Requests/        # Form request validation
│   └── Models/              # Eloquent models
├── database/
│   ├── factories/           # Model factories
│   ├── migrations/          # Database migrations
│   └── seeders/             # Database seeders
├── resources/
│   ├── js/
│   │   ├── components/      # Reusable React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── layouts/         # Layout components
│   │   ├── pages/           # Inertia.js pages
│   │   └── types/           # TypeScript type definitions
│   └── css/                 # Stylesheets
├── routes/
│   ├── web.php              # Web routes (Inertia pages)
│   ├── api.php              # API routes
│   └── auth.php             # Authentication routes
└── tests/                   # PHPUnit tests
```

## 🧪 Testing

```bash
# Run all tests
composer test
# Or
php artisan test

# Run specific test file
php artisan test tests/Feature/YourTest.php

# Run specific test method
php artisan test --filter=test_method_name
```

## 🔧 Development Commands

### Database

```bash
# Create new migration
php artisan make:migration create_table_name

# Run migrations
php artisan migrate

# Fresh migration with seeding
php artisan migrate:fresh --seed

# Rollback last migration
php artisan migrate:rollback

# Seed database
php artisan db:seed
```

### Code Quality

```bash
# Format PHP code
./vendor/bin/pint

# Run linting (if configured)
npm run lint
```

### Production Build

```bash
# Build frontend assets
npm run build

# Cache configuration
php artisan config:cache
php artisan route:cache
```

## 👥 User Roles

The application supports multiple user roles:

- **Admin**: Full system access
- **House Parent**: Residence management access
- **House Committee**: Limited administrative access
- **Student**: Standard user access

## 🔐 Authentication

The application uses Laravel Sanctum for authentication. Users can:
- Register new accounts
- Login with email and password
- Access protected routes via session or API tokens

## 📡 Real-time Features

Real-time functionality is powered by Laravel Broadcasting and Pusher:
- Live notifications
- Real-time messaging
- Event updates
- Vote notifications

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 📞 Support

For support, please open an issue in the repository or contact the development team.

## 🙏 Acknowledgments

- Laravel Framework
- React Community
- Inertia.js
- All contributors and maintainers

---

**Built with ❤️ using Laravel and React**

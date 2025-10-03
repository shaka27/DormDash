# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DormDash is a Laravel-based residence management system with a React/Inertia.js frontend. The application manages student residences, rooms, notifications, events, voting, messages, and user profiles.

## Tech Stack

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 18 with Inertia.js (both JSX and TSX)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, Bootstrap 5, shadcn/ui components (Radix UI)
- **Authentication**: Laravel Sanctum
- **Databases**: MySQL (primary), MongoDB, Redis (cache)
- **Containerization**: Docker via Laravel Sail

## Development Commands

### Starting Development Environment

```bash
# Start all services (server, queue, logs, vite) - preferred method
composer dev

# Or start individual services
php artisan serve        # Laravel server (http://localhost:8000)
npm run dev             # Vite dev server (HMR on port 5173)
php artisan queue:listen # Queue worker
php artisan pail        # Log viewer

# Using Docker
./vendor/bin/sail up    # Start Docker containers
./vendor/bin/sail down  # Stop Docker containers
```

### Testing

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

### Code Quality

```bash
# Format PHP code with Laravel Pint
./vendor/bin/pint

# Run linting
npm run lint    # ESLint (if configured)
```

### Database

```bash
# Run migrations
php artisan migrate

# Fresh migration with seeding
php artisan migrate:fresh --seed

# Rollback last migration
php artisan migrate:rollback

# Create new migration
php artisan make:migration create_table_name

# Seed database
php artisan db:seed
```

### Building for Production

```bash
# Build frontend assets
npm run build

# Clear and cache config/routes
php artisan config:cache
php artisan route:cache
```

## Architecture

### Backend Structure

**Models** (`app/Models/`): Core entities include User, Residence, Room, Campus, Bed, Group, GroupMember, GroupRole, Role, Event, Notification, Message, Vote, VoteOption, VoteResponse, Access.

**Controllers** (`app/Http/Controllers/`):
- `AuthController`: Authentication (login/logout)
- `ResidenceController`, `RoomController`: Residence and room management
- `NotificationController`: Notification CRUD
- `EventController`: Event management
- `VoteController`: Voting system
- `MessageController`: Messaging
- `ProfileController`: User profiles
- `UserController`: User management
- `Settings/`: Settings-related controllers

**Routes**:
- `routes/web.php`: Inertia.js page routes (authenticated with 'auth' middleware)
- `routes/api.php`: REST API endpoints (protected with 'auth:sanctum')
- `routes/auth.php`: Authentication routes
- `routes/settings.php`: Settings routes

**Middleware**: Standard Laravel middleware plus custom auth handling via Sanctum.

### Frontend Structure

**Entry Point**: `resources/js/app.jsx` - Configures Inertia.js and handles page resolution for both `.jsx` and `.tsx` files.

**Pages** (`resources/js/pages/`):
- `auth/`: Login and registration pages (New_Login, New_Register)
- `Student_Dashboard/`: Main dashboard pages (StudentDashboard, rooms, events, voting, notifications, messages)
- `Profile/`: User profile pages
- `settings/`: Settings pages
- `Maintenance/`: Maintenance page

**Layouts** (`resources/js/layouts/`):
- `app-layout.tsx`: Main application layout
- `auth-layout.tsx`: Authentication pages layout
- Layout-specific components in subdirectories

**Components** (`resources/js/components/`): Reusable React components including shadcn/ui components.

**Hooks** (`resources/js/hooks/`): Custom React hooks.

**Types** (`resources/js/types/`): TypeScript type definitions.

### Database Schema

Key relationships:
- Users belong to Residences, Rooms, and Campuses
- Residences have many Rooms
- Rooms have many Beds
- Users can have multiple Roles (via pivot)
- Groups have GroupMembers with GroupRoles
- Events track attendance via pivot table
- Votes have VoteOptions and users submit VoteResponses
- Messages are between users or groups
- Access table manages user access permissions

### Docker Configuration

The project uses Laravel Sail with:
- MySQL 8.0 (port 3306)
- MongoDB Atlas Local (port 27017)
- Redis (port 6379)
- Vite dev server (port 5173)

Environment variables in `.env` control service ports and configuration.

## Important Notes

- **Mixed JSX/TSX**: Frontend uses both `.jsx` and `.tsx` files. When creating new components, prefer TSX for type safety unless matching existing JSX patterns.
- **Inertia.js Pages**: All page components are auto-loaded from `resources/js/pages/`. Page names in routes match the directory structure (e.g., 'auth/New_Login' → `pages/auth/New_Login.jsx`).
- **API vs Web Routes**: API routes return JSON and use Sanctum tokens. Web routes render Inertia pages and use session auth.
- **TODO Comment**: Route file notes that all authenticated routes should be associated with a specific residence (not yet implemented).
- **Testing Database**: PHPUnit uses a separate `testing` database (configured in `phpunit.xml`). Docker includes `create-testing-database.sh` for MySQL.
- **Vite Configuration**: Configured for Docker with `0.0.0.0` host binding and HMR support.

## Common Development Workflows

### Adding a New Feature Page

1. Create page component: `resources/js/pages/YourFeature/YourPage.jsx`
2. Add route in `routes/web.php`: `Route::get('/your-route', fn() => Inertia::render('YourFeature/YourPage'))`
3. Create controller if needed: `php artisan make:controller YourController`
4. Add API routes in `routes/api.php` if the feature needs API endpoints

### Creating a New Model with Migration

1. Generate model with migration, factory, and seeder:
   ```bash
   php artisan make:model ModelName -mfs
   ```
2. Define schema in migration file (`database/migrations/`)
3. Define relationships in model (`app/Models/`)
4. Create factory fake data (`database/factories/`)
5. Add to database seeder (`database/seeders/DatabaseSeeder.php`)

### Running Single Test

```bash
php artisan test --filter=test_specific_feature
```

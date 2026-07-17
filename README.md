# YAROTECH WiFi Access System
Continue  opencode -s ses_0902d6730ffeuR3Ud75Yu4QsTG
Full-stack WiFi voucher selling platform with Paystack payment integration.

## Project Structure

```
access-code-system/
├── backend/          # Django REST API
│   ├── accounts/     # Authentication, users, OTP
│   ├── plans/        # WiFi plans management
│   ├── access_code/  # Voucher code lifecycle
│   ├── transactions/ # Paystack payments, webhooks
│   ├── notifications/# Email & in-app notifications
│   ├── core/         # Dashboard, settings, analytics
│   └── backend/      # Django project config
└── client/           # React + Vite + TypeScript
    └── src/
        ├── app/          # Bootstrap
        ├── features/     # Business domains
        ├── shared/       # Reusable UI components
        ├── layouts/      # Public, Customer, Admin
        ├── routes/       # React Router config
        ├── store/        # Zustand state
        ├── types/        # TypeScript types
        └── lib/          # API client, Axios
```

## Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

API docs at: http://localhost:8000/swagger/

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

App runs at: http://localhost:5173

## Tech Stack

**Backend:** Django 4.2, DRF, Celery + Redis, Paystack, JWT (SimpleJWT), Swagger

**Frontend:** React 18, Vite 6, TypeScript (strict), Tailwind CSS, TanStack Query, Zustand, React Hook Form + Zod, Axios

## API Endpoints

| Module | Base URL | Auth |
|--------|----------|------|
| Auth | `/api/v1/auth/` | Public / JWT |
| Plans | `/api/v1/plans/` | Public / JWT |
| Access Codes | `/api/v1/access-codes/` | JWT / Admin |
| Transactions | `/api/v1/transactions/` | JWT / Admin |
| Notifications | `/api/v1/notifications/` | JWT / Admin |
| Core | `/api/v1/core/` | JWT / Admin |

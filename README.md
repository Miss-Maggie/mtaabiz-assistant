# MtaaBiz Assistant

**Smart Business Tools for Kenyan SMEs**

MtaaBiz Assistant is a comprehensive platform designed to empower small and medium enterprises (SMEs) in Kenya. It provides essential tools to streamline business operations, from generating professional invoices to guiding users through business registration.

## Features

### 📄 Invoice Generator
Create professional, PDF-ready invoices in seconds. Automatically calculate totals and ensure your billing looks polished and trustworthy.

### 💬 Business Messages
Generate professional communication for various business needs:
- Payment reminders
- Follow-up messages
- Client appreciation notes

### 📢 Marketing Captions
Craft engaging social media captions tailored for platforms like Instagram, WhatsApp, and Facebook to boost your online presence.

### 📝 Registration Guide
A step-by-step guide to registering your business in Kenya, covering:
- Business name reservation (eCitizen)
- KRA PIN registration
- Business permits
- Opening a business bank account

## Technologies Used

This project is built using modern web technologies to ensure a fast, responsive, and seamless user experience.

- **Frontend**: [React](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend**: Django (Python)

## Getting Started

### Prerequisites
- Node.js & pnpm
- Python (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Miss-Maggie/mtaabiz-assistant.git
   cd mtaabiz-assistant
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   pnpm install
   pnpm run dev
   ```

3. **Backend Setup**
   *(Ensure you have a virtual environment set up)*
   ```bash
   cd backend
   pip install -r requirements.txt
   python manage.py runserver
   ```
## Deployment

### Backend (Django) - Suggested for Render/Heroku

1.  **Environment Variables**: Set the following on your host:
    - `SECRET_KEY`: A secure random string.
    - `DEBUG`: `False`
    - `ALLOWED_HOSTS`: Your API domain (e.g., `api.mtaabiz.com`).
    - `DATABASE_URL`: Connection string for your production database (PostgreSQL recommended).
    - `CORS_ALLOWED_ORIGINS`: Your frontend domain (e.g., `https://mtaabiz.com`).
2.  **Build Command**: `sh build.sh`
3.  **Start Command**: `gunicorn mtaabiz_backend.wsgi:application`

### Frontend (React/Vite) - Suggested for Vercel/Netlify

1.  **Environment Variables**:
    - `VITE_API_URL`: Your backend API URL (e.g., `https://api.mtaabiz.com/api`).
2.  **Build Command**: `pnpm run build`
3.  **Output Directory**: `dist`

---

## 4. PRO Features (Monetization)
- Unlimited Invoices (Free limit: 5)
- Exclusive Business Registration Templates
- Priority Support
```
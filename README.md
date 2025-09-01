# Yahavi Society - AGM RSVP System

A modern, responsive RSVP system for the Yahavi Society Annual General Meeting.

## Features

- **Resident RSVP Form**: Easy-to-use form for residents to confirm attendance
- **Dynamic Flat Selection**: Intelligent flat number selection based on tower, wing, and floor
- **Admin Panel**: Secure admin access to view all responses
- **Response Management**: Sort, filter, and export responses to CSV
- **Email Validation**: Prevents duplicate submissions
- **Responsive Design**: Works perfectly on all devices

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Azure Static Web Apps

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Admin Access

- **Password**: `yahavi2025`
- **Features**: View responses, export data, filter and sort

## Deployment

This application is configured for Azure Static Web Apps deployment. See `azure-deploy.md` for detailed deployment instructions.

## Project Structure

```
src/
├── components/
│   ├── RSVPForm.tsx      # Main RSVP form component
│   ├── ResponseList.tsx  # Admin response management
│   ├── AdminLogin.tsx    # Admin authentication
│   └── AdminPanel.tsx    # Admin dashboard
├── types/
│   └── form.ts          # TypeScript interfaces
└── App.tsx              # Main application component
```

## License

Private - Yahavi Society Internal Use Only
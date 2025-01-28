# Attendance Management System

A modern web-based attendance management system built with Next.js, featuring real-time attendance tracking with photo capture and location tracking.

## Features

- **User Dashboard**
  - Mark attendance with photo capture
  - Real-time location tracking
  - View daily attendance status
  - Automatic late/present status based on time (9:30 AM cutoff)

- **Admin Dashboard**
  - View all employee attendance records
  - Real-time statistics (Total, Present, Late, Absent)
  - Search functionality
  - Date-wise filtering
  - Photo and location verification

## Demo Features

For demonstration purposes, the application includes:
- Switch between Admin/Employee views
- Reset demo data functionality
- Persistent storage using localStorage
- Mock user data for testing

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context
- **Storage**: Local Storage (for demo)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd attendance-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Employee View**
   - Click "Mark Attendance" to start the process
   - Allow camera and location permissions when prompted
   - Take a photo
   - System automatically records time and determines status

2. **Admin View**
   - Click "Switch to Admin View" in the navigation
   - View all attendance records
   - Use search and date filters to find specific records
   - View attendance statistics

3. **Demo Reset**
   - Click "Reset Demo Data" to clear all records and start fresh

## Browser Requirements

- Modern browser with camera access support
- Location services enabled
- JavaScript enabled
- LocalStorage access

## Project Structure

```
attendance-management-system/
├── app/                    # Next.js app directory
│   ├── page.tsx           # User dashboard
│   └── admin/
│       └── page.tsx       # Admin dashboard
├── components/            # Reusable components
├── lib/                   # Utilities and contexts
└── public/               # Static assets
```

## Development Notes

- The system uses client-side rendering for camera and location features
- Attendance status is automatically determined based on time:
  - Before 9:30 AM: Present
  - After 9:30 AM: Late
- All data is stored in localStorage for demo purposes
- The application is fully responsive and works on both desktop and mobile

## Future Enhancements

- Backend integration with proper database storage
- User authentication and authorization
- Employee management system
- Reporting and analytics
- Export functionality for attendance records
- Email notifications for late/absent employees

## Contributing

Feel free to submit issues and enhancement requests!

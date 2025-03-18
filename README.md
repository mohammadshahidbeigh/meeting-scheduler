# Meeting Scheduler MVP

A streamlined meeting scheduling application built with Next.js that integrates Google SSO authentication and Google Meet functionality.

## Architecture & Design Decisions

### Technical Stack
- **Frontend**: Next.js 15 with App Router
- **Authentication**: NextAuth.js with Google OAuth
- **Styling**: Tailwind CSS
- **API Integration**: Google Calendar API for meeting management
- **Deployment**: Vercel

### Key Design Decisions
1. **App Router**: Utilizing Next.js 15's App Router for better routing and server components
2. **Server Actions**: Leveraging server-side functionality for secure API calls
3. **TypeScript**: Full TypeScript implementation for type safety
4. **Middleware Protection**: Route protection using NextAuth middleware
5. **Color Scheme**: Implemented a calming blue-based color palette (#90D5FF, #57B9FF, #eafffd) for trust and readability

## Setup Instructions

### Prerequisites
- Node.js 18.17 or later
- Google Cloud Console account
- Configured OAuth 2.0 credentials

### Environment Variables
Create a `.env.local` file with:
```bash
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
NEXTAUTH_SECRET=your_random_string
NEXTAUTH_URL=http://localhost:3000
```

### Installation
```bash
npm install
npm run dev
```

# Project Structure

This project follows a feature-first approach with Next.js 14/15 best practices. Here's an overview of the directory structure:

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes (grouped)
│   │   ├── login/        # Login page
│   │   └── error/        # Error page
│   ├── api/              # API routes
│   │   ├── auth/        # NextAuth API routes
│   │   ├── instant-meeting/  # Instant meeting API
│   │   └── schedule-meeting/ # Scheduled meeting API
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable components
│   ├── instant-meeting.tsx  # Instant meeting component
│   └── schedule-meeting.tsx # Scheduled meeting component
├── lib/                 # Third-party library configurations
│   └── auth.ts         # NextAuth configuration
├── middleware/         # Middleware functions
│   └── auth.ts        # Authentication middleware
├── types/             # TypeScript type definitions
└── styles/            # Global styles and CSS modules
```

## Directory Purposes

- **app/**: Contains all Next.js pages and layouts using the App Router
  - **(auth)/**: Grouped authentication-related pages
  - **api/**: API routes for handling meeting creation and authentication
- **components/**: Reusable UI components
  - `instant-meeting.tsx`: Component for creating instant meetings
  - `schedule-meeting.tsx`: Component for scheduling future meetings
- **lib/**: Third-party library configurations
  - `auth.ts`: NextAuth.js configuration and setup
- **middleware/**: Request middleware functions
  - `auth.ts`: Authentication middleware for protected routes
- **types/**: TypeScript type definitions and interfaces
- **styles/**: Global styles and CSS modules

## Best Practices

1. Keep features isolated in their respective directories
2. Use absolute imports with the `@/` alias
3. Maintain clear separation of concerns
4. Follow the principle of colocation
5. Keep components small and focused
6. Use TypeScript for type safety
7. Implement proper error boundaries
8. Follow Next.js routing conventions

### Deployment
1. Push to GitHub
2. Connect to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

## MVP Scope & Limitations

### Current Features
- Google SSO authentication
- Instant meeting creation
- Scheduled meeting creation
- Meeting link generation
- Basic form validation
- Responsive design

### Limitations
1. **Calendar Integration**
   - No recurring meetings
   - No participant management
   - No email notifications

2. **User Experience**
   - No meeting editing/deletion
   - No timezone management
   - No meeting history

3. **Technical**
   - No offline support
   - No meeting analytics
   - Limited error recovery

### Future Enhancements
- Meeting management (edit/delete)
- Participant invitations
- Email notifications
- Calendar view
- Meeting templates
- Timezone support
- Meeting recording options

## Security Considerations
- Protected API routes
- Secure token handling
- OAuth scope limitations
- HTTPS enforcement
- CSP headers

## Contributing
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License
MIT

## Support
For issues and feature requests, please use the GitHub issues page.

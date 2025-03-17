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

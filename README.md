# Mael | Maelewano - Unified Platform for Video Conferencing & Document Signing

**Mael** is a harmonized platform that integrates secure document signing and video conferencing into one seamless solution. Built with Next.js 15, TypeScript, and MongoDB Atlas.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Database Management](#database-management)
   - [FAQ Data Seeding](#faq-data-seeding)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Technologies Used](#technologies-used)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
   - [Vercel (Recommended)](#vercel-recommended)
   - [Environment Setup for Production](#environment-setup-for-production)
- [Learn More](#learn-more)
- [Contributing](#contributing)
- [Documentation](#documentation)
- [License](#license)
- [Troubleshooting](#troubleshooting)
   - [Common Issues](#common-issues)


<a id="features"></a>
## 🚀 Features

- **Video Conferencing**: Integrated with Whereby, Jitsi, and Agora
- **Document Signing**: Secure electronic signatures via DropboxSign
- **Email Notifications**: Automated email workflows with Resend
- **FAQ Management**: Dynamic FAQ system with search functionality
- **Responsive Design**: Modern UI with Tailwind CSS and shadcn/ui components
- **Meeting Scheduling**: Complete meeting workflow from scheduling to execution

<a id="prerequisites"></a>
## 📋 Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm/bun
- MongoDB Atlas account
- Environment variables configured (see `.env.example`)

<a id="installation"></a>
## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mael
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Configure all required environment variables
   - Ensure your MongoDB Atlas IP whitelist includes your current IP

4. **Database Setup**
   - Create a MongoDB Atlas cluster
   - Add your IP address to the Atlas IP whitelist
   - Update the `MONGODB_URI` in your `.env` file with your database name

<a id="getting-started"></a>
## 🚦 Getting Started

**Start the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) (or the available port shown in terminal) with your browser.

<a id="database-management"></a>
## 🗄️ Database Management

<a id="faq-data-seeding"></a>
### FAQ Data Seeding

The FAQ system includes automatic seeding, but you can manually manage the data:

**Seed FAQ data (only if collection is empty):**
```bash
# Using curl
curl http://localhost:3000/api/seed/faq

# Using PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/seed/faq" -Method GET

# Using browser
# Navigate to: http://localhost:3000/api/seed/faq
```

**Reset and reseed FAQ data (clears existing data first):**
```bash
# Using curl
curl "http://localhost:3000/api/seed/faq?action=reset"

# Using PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/seed/faq?action=reset" -Method GET

# Using browser
# Navigate to: http://localhost:3000/api/seed/faq?action=reset
```

<a id="project-structure"></a>
## 📁 Project Structure

```
mael/
├── app/                    # Next.js App Router
│   ├── Components/         # Reusable React components
│   ├── api/               # API routes
│   ├── faq/               # FAQ page
│   ├── host/              # Host functionality
│   ├── join/              # Join meeting page
│   └── schedule/          # Meeting scheduling
├── lib/                   # Utilities and configurations
│   ├── actions/           # Server actions
│   ├── data/              # Seed data
│   ├── models/            # MongoDB schemas
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
└── public/                # Static assets
```

<a id="environment-variables"></a>
## 🔧 Environment Variables

Key environment variables required:

```env
# Database
# Do not commit real credentials. Copy `.env.example` to `.env` and set values there.
MONGODB_URI=<mongodb+srv://user:password@cluster.mongodb.net/database_name>

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Email Services
RESEND_API_KEY=<your_resend_api_key>

# Video Conferencing
NEXT_PUBLIC_WHEREBY_SUBDOMAIN_URL=<your_whereby_subdomain_url>
NEXT_PUBLIC_WHEREBY_API_KEY=<your_whereby_api_key>

# Document Signing
NEXT_PUBLIC_DROPBOX_SIGN_CLIENT_ID=<your_dropbox_sign_client_id>
NEXT_DROPBOX_SIGN_API_KEY=<your_dropbox_sign_api_key>
```

<a id="technologies-used"></a>
## 🛠️ Technologies Used

- **Framework**: Next.js 15 with Turbopack
- **Language**: TypeScript
- **Database**: MongoDB Atlas with Mongoose
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Email**: Resend
- **Video Conferencing**: Whereby, Jitsi, Agora
- **Document Signing**: DropboxSign
- **State Management**: React Hooks
- **Form Handling**: React Hook Form
- **Validation**: Zod

<a id="available-scripts"></a>
## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

<a id="deployment"></a>
## 🚀 Deployment

<a id="vercel-recommended"></a>
### Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push

<a id="environment-setup-for-production"></a>
### Environment Setup for Production

Ensure these are configured in your deployment platform:

- All environment variables from `.env`
- MongoDB Atlas IP whitelist includes deployment platform IPs
- API keys for all integrated services
- Proper domain configuration for callbacks

<a id="learn-more"></a>
## 📚 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [MongoDB Atlas](https://docs.atlas.mongodb.com/) - MongoDB cloud database
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Reusable component library

<a id="contributing"></a>
## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

<a id="documentation"></a>
## 📚 Documentation

- Detailed operational and developer guides live in the `docs/` directory:
   - [Testing Guide](docs/TESTING.md)
   - [Deployment Guide](docs/DEPLOYMENT.md)

- Keep `README.md` as the high-level project overview. For testing, deployment, and other workflows, see the files above in `docs/`.

<a id="license"></a>
## 📄 License

This project is proprietary software. All rights reserved.

<a id="troubleshooting"></a>
## 🆘 Troubleshooting

<a id="common-issues"></a>
### Common Issues

**MongoDB Connection Error:**
- Check your IP whitelist in MongoDB Atlas
- Verify `MONGODB_URI` includes the correct database name
- Ensure network connectivity

**Port Already in Use:**
- Next.js will automatically use the next available port
- Check terminal output for the correct port number

**FAQ Data Not Showing:**
- Run the FAQ seed command manually
- Check database connection and permissions
- Verify FAQ collection exists and has data

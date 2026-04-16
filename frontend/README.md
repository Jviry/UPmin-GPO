# Frontend - UPmin-GPO

Next.js frontend for the GPO Management System built with React and Tailwind CSS.

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` - Next.js app router and pages
- `components/` - Reusable React components
- `public/` - Static assets
- `styles/` - Global styles and Tailwind CSS configuration

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technologies

- **Next.js 14** - React framework
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety

## Environment Variables

Create a `.env.local` file in the frontend directory:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Adjust the API URL based on your backend server configuration.

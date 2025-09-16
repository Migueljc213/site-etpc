# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Type
Next.js 15.5.3 application with TypeScript, React 19, and Tailwind CSS v4.

## Commands

### Development
- `npm run dev` - Start the development server on http://localhost:3000
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Project Structure

This is a Next.js app using the App Router pattern:
- `/src/app/` - Contains the main application code using App Router conventions
  - `layout.tsx` - Root layout component
  - `page.tsx` - Home page component
  - `globals.css` - Global styles with Tailwind CSS directives
- TypeScript path alias: `@/*` maps to `./src/*`

## Key Configuration

- **TypeScript**: Strict mode enabled, using module resolution "bundler"
- **ESLint**: Configured with Next.js core-web-vitals and TypeScript rules
- **Tailwind CSS**: Version 4 with PostCSS integration

## Development Notes

- The application auto-updates when files are edited during development
- Pages are created in the `/src/app/` directory following Next.js App Router conventions
- Components and utilities should be placed under `/src/` and imported using the `@/` alias
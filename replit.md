# Overview

This is a Next.js starter application that demonstrates Hume AI's Empathic Voice Interface (EVI). The application provides a real-time voice conversation interface that can detect and analyze emotional expressions during voice interactions. It features a modern chat interface with voice controls, emotion visualization, and real-time audio processing capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application uses Next.js 14 with the App Router pattern and TypeScript for type safety. The UI is built with React 18 and styled using Tailwind CSS with a shadcn/ui component library for consistent design patterns. The application implements a client-side voice interface using Hume's React SDK for real-time voice interactions.

## Component Structure
The application follows a modular component architecture:
- **Chat Component**: Main orchestrator for voice interactions, handles message flow and error states
- **Messages Component**: Displays conversation history with animated message rendering
- **Controls Component**: Provides voice control interface (mute/unmute, disconnect, microphone visualization)
- **StartCall Component**: Manages connection initiation with access token authentication
- **Expressions Component**: Visualizes emotional expression data from voice analysis

## Voice Processing Architecture
The voice interface is powered by Hume's VoiceProvider which manages WebSocket connections for real-time audio streaming. The system processes audio input through microphone FFT analysis and provides emotional expression detection with confidence scores. Voice controls support mute/unmute functionality and visual feedback through animated microphone indicators.

## Authentication & Security
Authentication uses Hume's access token system generated server-side from API and secret keys. The application implements secure token fetching on the server using the 'server-only' package to prevent client-side exposure of sensitive credentials. Access tokens are passed to client components for voice connection establishment.

## Styling & Theme System
The application uses Tailwind CSS with a custom design system based on CSS custom properties for color theming. A dark/light theme system is implemented using next-themes with smooth transitions. The design follows a modern, card-based layout with rounded corners and subtle shadows.

## State Management
Component state is managed through React hooks and context patterns. The VoiceProvider handles voice-related state including connection status, muting state, and message history. Local component state manages UI interactions and animations using Framer Motion for smooth transitions.

# External Dependencies

## Hume AI Services
- **@humeai/voice-react**: React SDK for voice interface integration
- **hume**: Core Hume AI SDK for access token generation and API interactions
- Requires HUME_API_KEY and HUME_SECRET_KEY environment variables
- Optional NEXT_PUBLIC_HUME_CONFIG_ID for custom voice configurations

## UI and Animation Libraries
- **shadcn/ui**: Component library built on Radix UI primitives
- **@radix-ui/react-slot, @radix-ui/react-toggle**: Headless UI components
- **motion (Framer Motion)**: Animation library for smooth transitions and micro-interactions
- **lucide-react**: Icon library for consistent iconography
- **next-themes**: Theme management for dark/light mode switching

## Styling and Design
- **tailwindcss**: Utility-first CSS framework with custom configuration
- **tailwind-merge**: Utility for merging Tailwind classes
- **class-variance-authority**: Type-safe variant handling for components
- **geist**: Font family (Sans and Mono variants)

## Development and Utility Libraries
- **typescript**: Type safety and developer experience
- **react-virtualized**: Virtual scrolling for performance optimization
- **sonner**: Toast notification system
- **ts-pattern**: Pattern matching utilities
- **remeda**: Functional programming utilities
- **clsx**: Conditional className utility

## Deployment Platform
Configured for Vercel deployment with environment variable management for Hume AI credentials and optional configuration IDs.
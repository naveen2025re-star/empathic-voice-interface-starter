# Overview

**MindSpace** is an AI-powered emotional support companion that transforms Hume AI's Empathic Voice Interface into a therapeutic conversational AI. The application provides real-time voice interactions with emotion detection, mood tracking, breathing exercises, and mental health support tools. It's designed as a consumer-first therapeutic platform that offers empathetic listening and emotional wellness features while maintaining strict privacy standards.

# User Preferences

- **Communication Style**: Simple, everyday language with therapeutic tone
- **Design Philosophy**: Consumer-first, calming therapeutic interface with soft color palettes  
- **Privacy Focus**: On-device data storage, transparent privacy controls, HIPAA-grade standards
- **Mental Health Features**: Mood tracking, breathing exercises, crisis resources, emotional insights

# System Architecture

## Frontend Architecture
The application uses Next.js 14 with App Router and TypeScript for type safety. The UI implements a therapeutic design system using Tailwind CSS with custom OKLCH color tokens for calming blue-green therapeutic palettes. Components are built with shadcn/ui for consistent patterns and Framer Motion for smooth, therapeutic animations.

## Component Structure - Therapeutic AI Features
The application follows a modular therapeutic architecture:
- **Chat Component**: Voice conversation orchestrator with therapeutic messaging and empathetic responses
- **Navigation Component**: Integrated therapeutic tools (mood tracking, breathing exercises, privacy controls)
- **MoodTracker Component**: Emotional wellness dashboard with mood logging, intensity tracking, and valence-based trend analysis
- **BreathingExercise Component**: Guided breathing exercises (box breathing, 4-7-8, energizing) with animated visual cues
- **PrivacyModal Component**: Comprehensive privacy controls, data management, and crisis resources
- **TherapeuticConfig System**: JSON-based conversation prompts, emotional responses, coping strategies, and crisis detection

## Therapeutic Voice Processing Architecture
The voice interface leverages Hume's emotion-aware AI for therapeutic conversations. The system processes audio for emotional expression detection and responds with contextually appropriate therapeutic language. The application includes therapeutic conversation starters, emotion-specific responses, and crisis language detection for safety. Voice interactions are designed to provide empathetic listening and emotional validation.

## Privacy & Security - Mental Health Focus
The application implements healthcare-grade privacy for sensitive mental health data:
- **On-Device Storage**: Mood and wellness data stored locally via localStorage with user consent controls
- **TLS Encryption**: Voice connections secured with TLS, audio processed but not stored
- **Privacy Transparency**: Comprehensive privacy modal with data visibility, management controls, and clear deletion options
- **Crisis Safety**: Crisis language detection with immediate resource provision (988 Suicide Prevention, Crisis Text Line)
- **HIPAA-Grade Standards**: Mental health data handling follows healthcare privacy requirements

## Therapeutic Design System
The application uses a custom therapeutic color palette built with OKLCH color tokens for consistent, calming aesthetics:
- **Light Theme**: Soft blue-white backgrounds with therapeutic blue primary colors and gentle green accents
- **Dark Theme**: Deep blue-gray backgrounds with softer primary colors for reduced eye strain
- **Therapeutic Components**: Custom CSS classes (therapeutic-card, therapeutic-button, therapeutic-accent) for consistent therapeutic styling
- **Smooth Transitions**: All elements include gentle transitions and micro-animations for a calming user experience

## State Management - Wellness Data
Component state manages therapeutic features and wellness data:
- **Voice State**: VoiceProvider manages therapeutic conversation state and emotional context
- **Mood Data**: MoodTracker persists emotional wellness data locally with timestamp and valence tracking
- **Breathing State**: BreathingExercise manages guided breathing sessions with proper cleanup on modal close
- **Privacy State**: User consent and data visibility preferences managed across components
- **Therapeutic Context**: Emotion-based responses and coping strategies loaded from JSON configuration

# External Dependencies

## Hume AI Services - Therapeutic Configuration
- **@humeai/voice-react**: React SDK configured for therapeutic voice interactions with emotion detection
- **hume**: Core SDK for empathetic AI responses and emotional intelligence
- **Required Environment Variables**: HUME_API_KEY and HUME_SECRET_KEY for production therapeutic conversations
- **Therapeutic Prompts**: Custom JSON configuration with conversation starters, emotion responses, coping strategies, and crisis resources

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
Configured for Vercel deployment as a mental health support platform:
- **Environment Management**: Secure Hume AI credentials for production therapeutic conversations
- **Privacy Compliance**: On-device storage reduces server-side data exposure for sensitive mental health information
- **Crisis Resources**: Integrated crisis support hotlines and safety resources for mental health emergencies
- **Consumer Ready**: Professional therapeutic interface suitable for direct consumer mental health support
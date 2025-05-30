# PathMentor Design Document

## Summary
PathMentor is an AI-powered career planning and roadmap generation platform. It provides secure authentication, personalized user dashboards, and AI-generated career roadmaps.

## Architecture Overview
- **Frontend:** React (with Ant Design), communicates with Firebase and AI APIs.
- **Authentication:** Firebase Auth (Google, Email/Password, optionally Microsoft)
- **AI Integration:** OpenAI/Azure OpenAI for roadmap generation
- **State Management:** React Context
- **Storage:** Firestore (Firebase)

## Component-Level Design
- `Login`: Handles user authentication (email/password, Google, Microsoft)
- `Home`: Displays user info and generated roadmaps
- `ProtectedRoute`: Guards private routes
- `RoadmapGenerator`: Interacts with AI API


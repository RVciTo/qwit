# Recovery Tracker

A React-based web application for tracking recovery progress from multiple addictions. This application helps users monitor their progress, providing insights and encouragement throughout their recovery journey.

## Features

- **Multi-Addiction Tracking**: Track progress for multiple addictions simultaneously
- **Visual Progress Indicators**: Weather-themed icons show recovery progress stages
- **Health Insights**: Personalized health recovery messages based on clean days
- **Habit Rewiring Tips**: Custom messages to help build better habits
- **Persistent Storage**: Local storage integration for progress tracking
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Technical Stack

- React
- TypeScript
- Tailwind CSS
- date-fns for date calculations
- Lucide React for icons
- Papa Parse for CSV parsing

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. First-time users will see an onboarding screen to add addictions they want to track
2. Each addiction requires a name and quit date
3. The dashboard shows:
   - Global overview of all tracked addictions
   - Detailed view for each addiction with progress and messages
   - Weather icons indicating progress stages
   - Health recovery and habit rewiring messages

## Project Structure

- `/src/components/` - React components
- `/src/data/` - CSV data for recovery messages
- `/src/App.tsx` - Main application component
- `/src/index.css` - Global styles and Tailwind imports

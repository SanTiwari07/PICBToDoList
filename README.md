# Taskora - Premium Task Management

A modern, premium task management application built with React, TypeScript, and Vite. Features drag-and-drop kanban boards, priority management, and beautiful themes.

## Features

- 🎯 **Priority-based Organization** - Organize tasks by High, Medium, and Low priority
- 🖱️ **Drag & Drop** - Intuitive drag-and-drop interface for task management
- 🌓 **Dark Mode** - Beautiful light and dark themes
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 📄 **PDF Export** - Export your tasks as PDF reports
- ✨ **Modern UI** - Built with shadcn/ui components and Tailwind CSS

## Project Structure

```
project/
├── public/
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── ui/          # shadcn/ui components
│   │   ├── TaskCard.tsx
│   │   ├── TopNav.tsx
│   │   └── ...
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── AddTask.tsx
│   │   └── NotFound.tsx
│   ├── hooks/
│   │   ├── useTasks.ts
│   │   └── useTheme.ts
│   ├── contexts/
│   │   └── TaskContext.tsx
│   ├── utils/
│   │   └── utils.ts
│   ├── styles/
│   │   └── index.css
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```


Live Project: https://taskora-indol.vercel.app/



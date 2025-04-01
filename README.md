# Schnode - No-Code Builder Application

https://schnode.vercel.app/

Schnode is a modern no-code application builder that allows users to visually construct interfaces by dragging and dropping UI components onto a canvas. Built with Next.js, TypeScript, and shadcn/ui, it provides a powerful yet intuitive way to create custom applications without writing code.

![image](https://github.com/user-attachments/assets/a87256a3-4524-409d-a415-306d1c81c2ca)
![image](https://github.com/user-attachments/assets/9e2c69b6-2c72-4998-b8a7-276583a1c69d)

## Features

- **Drag-and-Drop Interface**: Create layouts by dragging components from a library onto a canvas
- **Component Library**: Access pre-built UI components based on shadcn/ui
- **API Data Integration**: Load data from APIs and display them in interactive tables
- **Real-time Configuration**: Edit component properties through an intuitive configuration panel
- **Preview Mode**: Toggle between edit and preview modes to test functionality
- **Responsive Design**: Layouts automatically adapt to different screen sizes
- **Animations**: Animations powered by motion-primitives
- **Light/Dark Mode**: Support for theme customization
- **Save/Load Layouts**: Export and import your designs as JSON
- **End-to-End Testing**: Comprehensive Playwright tests ensure reliability

## Tech Stack

- **Framework**: Next.js
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **State Management**: Jotai
- **Drag and Drop**: react-dnd
- **Animations**: motion-primitives
- **Styling**: Tailwind CSS
- **Testing**: Playwright
- **Performance Monitoring**: Lighthouse CI

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- pnpm 8.x or higher

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/olwooz/schnode.git
   cd schnode
   ```

2. Install dependencies

   ```bash
   pnpm i
   ```

3. Start the development server

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser

### Build for Production

```bash
pnpm build
pnpm start
```

## Running Tests

- Run all tests:

  ```bash
  pnpm test
  ```

- Run tests with UI:

  ```bash
  pnpm test:ui
  ```

- Run tests in headed mode:

  ```bash
  pnpm test:headed
  ```

## Lighthouse CI Setup

This project includes automated Lighthouse CI testing to ensure performance, accessibility, and best practices.

### Local Testing

1. Install Lighthouse CLI globally:

   ```bash
   pnpm i -g @lhci/cli
   ```

2. Build your project:

   ```bash
   pnpm build
   ```

3. Run Lighthouse:
   ```bash
   lhci autorun
   ```

### CI/CD Integration

Lighthouse tests automatically run on GitHub Actions for all pull requests and pushes to the main branch. Results are posted as PR comments.

## Project Structure

```
schnode/
├── components/        # Reusable UI components
├── src/
|   ├── app/                     # Next.js App Router structure
|   ├── components/              # Application components
|   │   ├── ui/                  # shadcn/ui components
|   │   ├── renderer/            # Component renderers for the canvas
|   │   ├── draggable/           # Drag and drop implementation components
|   │   ├── layout/              # Application layout components
|   │   ├── motion-primitives/   # Animation components
|   │   ├── DndProvider.tsx      # React DnD provider
|   │   ├── ThemeProvider.tsx    # Theme provider for light/dark mode
|   │   ├── DeviceProvider.tsx   # Device detection provider
|   │   └── ClientDeviceProvider.tsx # Client-side device provider
|   │
|   ├── atoms/                   # Jotai atoms for state management
|   ├── constants/               # Application constants
|   ├── hooks/                   # Custom React hooks
|   ├── lib/                     # Utility libraries and helpers
|   ├── types/                   # TypeScript type definitions
|   └── utils/                   # Utility functions
├── tests/             # Playwright tests
└── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



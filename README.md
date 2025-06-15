# Node Canvas App

A ReactFlow-based task management application with interactive node creation and E2E testing.

## Features

- **Interactive Canvas**: Click anywhere on the canvas to create new task nodes
- **Auto-incremented Labels**: Nodes are automatically labeled as "Task 1", "Task 2", etc.
- **ReactFlow Integration**: Built on top of ReactFlow for professional node-based interfaces
- **State Management**: Uses Zustand for simple and efficient state management
- **E2E Testing**: Comprehensive Playwright tests for user interactions

## Project Structure

```
nodes/
├── package.json          # Root workspace configuration
├── frontend/
│   ├── src/
│   │   ├── App.tsx       # Main React component with ReactFlow
│   │   ├── store.ts      # Zustand store for state management
│   │   ├── main.tsx      # React entry point
│   │   └── index.css     # Styling
│   ├── tests/
│   │   └── basic-interaction.spec.ts  # E2E tests
│   ├── playwright.config.ts           # Playwright configuration
│   └── package.json                   # Frontend dependencies
└── README.md
```

## Technology Stack

- **Frontend**: Vite + React + TypeScript
- **Node Interface**: ReactFlow
- **State Management**: Zustand
- **E2E Testing**: Playwright (Chromium, Firefox, WebKit)
- **Build Tool**: Vite
- **Linting**: ESLint with TypeScript support

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

1. Install dependencies:
   ```bash
   npm run install-all
   ```

2. Install Playwright browsers:
   ```bash
   cd frontend
   npm run test:install
   ```

### Development

Start the development server:
```bash
npm run dev
```

This will start the Vite dev server at `http://localhost:5173`

### Usage

1. **Adding Nodes**: Click anywhere on the blank canvas to create a new task node
2. **Node Labels**: Each node is automatically labeled with an incremented task number
3. **Moving Nodes**: Drag nodes around the canvas to reposition them
4. **Connecting Nodes**: Drag from node handles to create connections (if needed)

### Testing

Run E2E tests:
```bash
npm run test:e2e
```

Run tests with UI:
```bash
cd frontend
npm run test:e2e:ui
```

View test report:
```bash
cd frontend
npx playwright show-report
```

### Test Coverage

The E2E tests cover:
- ✅ Canvas loading and visibility
- ✅ Node creation on click
- ✅ Multiple node creation
- ✅ Node positioning verification
- ✅ Auto-incremented labeling

## Scripts

### Root Level
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test:e2e` - Run E2E tests

### Frontend Level
- `npm run dev` - Start Vite dev server
- `npm run build` - Build React app
- `npm run test:e2e` - Run Playwright tests
- `npm run test:e2e:ui` - Run tests with Playwright UI
- `npm run lint` - Lint TypeScript/React code

## Development Notes

- The app uses ReactFlow's built-in `onPaneClick` event to handle canvas clicks
- State is managed through Zustand with proper ReactFlow change handlers
- All E2E tests run across Chromium, Firefox, and WebKit browsers
- The Playwright config includes automatic dev server startup for testing

## Future Enhancements

- Add node deletion functionality
- Implement node editing capabilities
- Add different node types
- Save/load functionality
- Export canvas as image 
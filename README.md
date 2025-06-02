# Graph-Based Task Manager

A modern task management application that represents tasks as nodes in a graph, with edges representing relationships between tasks. Features include AI-powered task summarization and decomposition.

## Features

- Graph-based task visualization using React Flow
- Task relationships (dependencies, semantic similarity)
- AI-powered task summarization and decomposition
- Interactive zooming and manipulation of task nodes
- Modern UI with Material-UI components

## Tech Stack

- **Frontend**: React, TypeScript, React Flow, Material-UI
- **Backend**: Node.js, Express, TypeScript
- **Database**: Neo4j
- **AI**: OpenAI API

## Prerequisites

- Node.js (v18 or later)
- Neo4j Database
- OpenAI API Key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd graph-task-manager
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Server
cp server/.env.example server/.env
# Edit server/.env with your Neo4j and OpenAI credentials

# Client
cp client/.env.example client/.env
```

4. Start Neo4j database

5. Start the development servers:
```bash
# Start both client and server
npm run dev
```

## Project Structure

```
.
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API services
│   │   ├── store/        # Zustand store
│   │   └── types/        # TypeScript types
│   └── package.json
├── server/                # Backend Express application
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # Data models
│   │   ├── routes/       # Express routes
│   │   ├── services/     # Business logic
│   │   └── types/        # TypeScript types
│   └── package.json
└── package.json          # Root package.json
```

## API Endpoints

- `POST /api/tasks` - Create a new task
- `GET /api/tasks` - Get all tasks
- `POST /api/relationships` - Create a task relationship
- `GET /api/graph` - Get the entire task graph
- `GET /api/tasks/:taskId/summarize` - Summarize connected tasks
- `POST /api/tasks/:taskId/decompose` - Decompose a task into subtasks

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
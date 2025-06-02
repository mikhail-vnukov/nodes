import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes';
import { initNeo4j, closeDriver } from './config/neo4j';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', taskRoutes);

// Initialize Neo4j
initNeo4j();

// Start server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await closeDriver();
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
}); 
import { vi, afterEach } from 'vitest';
import { Driver, Session } from 'neo4j-driver';

// Mock Neo4j driver
const mockSession = {
  run: vi.fn(),
  close: vi.fn(),
  executeRead: vi.fn(),
  executeWrite: vi.fn(),
} as unknown as Session;

const mockDriver = {
  verifyConnectivity: vi.fn().mockResolvedValue(undefined),
  close: vi.fn().mockResolvedValue(undefined),
  session: () => mockSession,
  rxSession: vi.fn(),
  _id: 'mock-driver',
  _meta: {},
  _config: {},
} as unknown as Driver;

// Mock the driver function
const driver = vi.fn().mockReturnValue(mockDriver);

// Mock the neo4j-driver module
vi.mock('neo4j-driver', () => {
  const neo4j = {
    driver,
    auth: {
      basic: (username: string, password: string) => ({ username, password })
    }
  };
  return {
    default: neo4j,
    driver,
  };
});

// Mock OpenAI for AI features
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'Mocked AI response' } }],
        }),
      },
    },
  })),
}));

// Reset all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});

export { mockDriver, driver, mockSession }; 
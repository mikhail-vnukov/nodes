import { vi } from 'vitest';

// Neo4j mock
const mockDriver = {
  verifyConnectivity: vi.fn().mockResolvedValue(undefined),
  close: vi.fn().mockResolvedValue(undefined),
  session: vi.fn(),
  rxSession: vi.fn(),
  _id: 'mock-driver',
  _meta: {},
  _config: {},
};

const driverSpy = vi.fn().mockReturnValue(mockDriver);

vi.mock('neo4j-driver', () => ({
  default: { driver: driverSpy },
  driver: driverSpy,
}));

export { mockDriver, driverSpy }; 
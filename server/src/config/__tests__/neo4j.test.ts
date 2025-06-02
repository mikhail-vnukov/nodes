import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Driver } from 'neo4j-driver';
import { mockDriver, driver } from '../../test/setup';

describe('Neo4j Configuration', () => {
  let initNeo4j: typeof import('../neo4j').initNeo4j;
  let getDriver: typeof import('../neo4j').getDriver;
  let closeDriver: typeof import('../neo4j').closeDriver;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    ({ initNeo4j, getDriver, closeDriver } = await import('../neo4j'));
  });

  describe('initNeo4j', () => {
    it('initializes Neo4j driver with correct configuration', async () => {
      const driverInstance = await initNeo4j();
      expect(driver).toHaveBeenCalledWith(
        'neo4j://localhost:7687',
        { username: 'neo4j', password: 'password' }
      );
      expect(driverInstance.verifyConnectivity).toHaveBeenCalled();
      expect(typeof driverInstance.session).toBe('function');
      expect(typeof driverInstance.close).toBe('function');
    });

    it('throws error if connection fails', async () => {
      mockDriver.verifyConnectivity.mockRejectedValueOnce(new Error('Connection failed'));
      await expect(async () => {
        await initNeo4j();
      }).rejects.toThrow('Connection failed');
    });
  });

  describe('getDriver', () => {
    it('returns the initialized driver', async () => {
      await initNeo4j();
      const driverInstance = getDriver();
      expect(typeof driverInstance.session).toBe('function');
      expect(typeof driverInstance.close).toBe('function');
    });

    it('throws error if driver is not initialized', () => {
      expect(() => getDriver()).toThrow('Neo4j driver not initialized');
    });
  });

  describe('closeDriver', () => {
    it('closes the driver connection', async () => {
      await initNeo4j();
      await closeDriver();
      expect(mockDriver.close).toHaveBeenCalled();
    });

    it('handles closing when driver is not initialized', async () => {
      await closeDriver();
      expect(mockDriver.close).not.toHaveBeenCalled();
    });
  });
}); 
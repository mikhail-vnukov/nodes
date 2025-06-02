import neo4j, { Driver } from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const {
  NEO4J_URI = 'neo4j://localhost:7687',
  NEO4J_USERNAME = 'neo4j',
  NEO4J_PASSWORD = 'password'
} = process.env;

let driver: Driver | null = null;

export const initNeo4j = async (): Promise<Driver> => {
  try {
    driver = neo4j.driver(
      NEO4J_URI,
      neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
    );
    await driver.verifyConnectivity();
    console.log('Connected to Neo4j');
    return driver;
  } catch (error) {
    console.error('Error connecting to Neo4j:', error);
    throw error;
  }
};

export const getDriver = (): Driver => {
  if (!driver) {
    throw new Error('Neo4j driver not initialized');
  }
  return driver;
};

export const closeDriver = async (): Promise<void> => {
  if (driver) {
    await driver.close();
    driver = null;
    console.log('Neo4j connection closed');
  }
}; 
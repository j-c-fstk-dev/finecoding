import { getResources } from '../resources';
import { getDocs, collection, query, orderBy } from 'firebase/firestore';
import type { ResourceCategory, PricingModel } from '@/types';

// Mock the entire 'firebase/firestore' module and the db object
jest.mock('@/lib/firebase', () => ({
  db: {}, // Provide a mock db object
}));

jest.mock('firebase/firestore', () => ({
  getDocs: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  doc: jest.fn(),
  where: jest.fn(),
  limit: jest.fn(),
  increment: jest.fn(),
  deleteDoc: jest.fn(),
  updateDoc: jest.fn(),
  addDoc: jest.fn(),
  getDoc: jest.fn(),
  Timestamp: { fromDate: jest.fn() },
  serverTimestamp: jest.fn(),
}));

// Type assertion for the mocked functions
const mockedGetDocs = getDocs as jest.Mock;

describe('Resource Library Functions', () => {

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getResources', () => {
    it('should return an array of resources on successful fetch', async () => {
      // Arrange
      const mockDate = new Date();
      const mockDocs = {
        docs: [
          {
            id: 'res1',
            data: () => ({
              name: 'Test Resource',
              description: 'A resource for testing.',
              link: 'http://example.com',
              category: 'Developer Tools' as ResourceCategory,
              pricing: 'Free' as PricingModel,
              favorites: 5,
              createdAt: { toDate: () => mockDate }, // Simple mock for Timestamp
            }),
          },
        ],
      };
      mockedGetDocs.mockResolvedValue(mockDocs);

      // Act
      const resources = await getResources();

      // Assert
      expect(resources).toHaveLength(1);
      expect(resources[0].name).toBe('Test Resource');
      expect(resources[0].createdAt).toEqual(mockDate);
      expect(collection).toHaveBeenCalledWith(expect.anything(), 'resources');
      expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc');
    });

    it('should return an empty array when Firestore returns no documents', async () => {
        // Arrange
        mockedGetDocs.mockResolvedValue({ docs: [] });

        // Act
        const resources = await getResources();

        // Assert
        expect(resources).toEqual([]);
    });

    it('should return an empty array and log an error on failure', async () => {
        // Arrange
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const error = new Error('Firestore connection failed');
        mockedGetDocs.mockRejectedValue(error);

        // Act
        const resources = await getResources();

        // Assert
        expect(resources).toEqual([]);
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching resources:", error);
        
        // Clean up spy
        consoleErrorSpy.mockRestore();
    });
  });
});

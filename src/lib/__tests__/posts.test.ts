import { getPosts } from '../posts';
import { getDocs, collection, query, orderBy, where, limit, addDoc, updateDoc, deleteDoc, doc, Timestamp, serverTimestamp, increment } from 'firebase/firestore';

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
  Timestamp: { fromDate: (date: Date) => date },
  serverTimestamp: jest.fn(),
}));

// Type assertion for the mocked functions
const mockedGetDocs = getDocs as jest.Mock;

describe('Post Library Functions', () => {

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getPosts', () => {
    it('should return an array of posts on successful fetch', async () => {
      // Arrange
      const mockDate = new Date();
      const mockDocs = {
        docs: [
          {
            id: '1',
            data: () => ({
              title: 'Test Post 1',
              slug: 'test-post-1',
              tags: ['testing', 'jest'],
              excerpt: 'This is a test post.',
              imageUrl: 'http://example.com/image.png',
              imageHint: 'test image',
              likes: 10,
              content: 'test content',
              date: mockDate, // Firestore Timestamps are mocked to return Dates
            }),
          },
        ],
      };
      mockedGetDocs.mockResolvedValue(mockDocs);

      // Act
      const posts = await getPosts();

      // Assert
      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe('Test Post 1');
      expect(posts[0].date).toEqual(mockDate);
      expect(collection).toHaveBeenCalledWith(expect.anything(), 'posts');
      expect(orderBy).toHaveBeenCalledWith('date', 'desc');
    });

    it('should return an empty array when Firestore returns no documents', async () => {
        // Arrange
        mockedGetDocs.mockResolvedValue({ docs: [] });

        // Act
        const posts = await getPosts();

        // Assert
        expect(posts).toEqual([]);
    });

    it('should return an empty array and log an error on failure', async () => {
        // Arrange
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const error = new Error('Firestore connection failed');
        mockedGetDocs.mockRejectedValue(error);

        // Act
        const posts = await getPosts();

        // Assert
        expect(posts).toEqual([]);
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching posts:", error);
        
        // Clean up spy
        consoleErrorSpy.mockRestore();
    });
  });
});

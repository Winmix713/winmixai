import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  validateModelEntry,
  validateModelRegistry,
  ModelStatus,
  ModelRegistryEntry,
  getAllModels,
  getActiveModel,
  getModelsByStatus,
  getModelById,
} from '../../lib/model-registry';

// Mock the model registry data
const mockRegistryData = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    version: 'v1.0.0',
    algorithm: 'LogisticRegression',
    metrics: {
      accuracy: 0.85,
      f1_score: 0.83,
      precision: 0.87,
      recall: 0.79,
    },
    created_at: '2024-01-15T10:30:00.000Z',
    status: 'active' as ModelStatus,
    file_path: 'models/v1_champion.pkl',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    version: 'v1.1.0',
    algorithm: 'RandomForest',
    metrics: {
      accuracy: 0.88,
      f1_score: 0.86,
      precision: 0.89,
      recall: 0.83,
    },
    created_at: '2024-01-20T14:45:00.000Z',
    status: 'candidate' as ModelStatus,
    file_path: 'models/v1_candidate.pkl',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    version: 'v1.2.0',
    algorithm: 'GradientBoosting',
    metrics: {
      accuracy: 0.90,
      f1_score: 0.88,
      precision: 0.91,
      recall: 0.85,
    },
    created_at: '2024-01-25T16:20:00.000Z',
    status: 'archived' as ModelStatus,
    file_path: 'models/v1_archived.pkl',
  },
];

// Mock the fetch function
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Helper to create a proper Response mock
function createMockResponse(data: unknown, ok: boolean = true, status: number = 200) {
  const response = {
    ok,
    status,
    json: async () => data,
    clone: () => ({ ...response }),
    text: async () => JSON.stringify(data),
    headers: new Map(),
    redirected: false,
    statusText: ok ? 'OK' : 'Error',
    type: 'basic' as ResponseType,
    url: '/models/model_registry.json',
    body: null,
    bodyUsed: false,
    arrayBuffer: async () => new ArrayBuffer(0),
    blob: async () => new Blob(),
    formData: async () => new FormData(),
  };
  return response;
}

describe('Model Registry', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Default successful response with mock data
    mockFetch.mockResolvedValue(createMockResponse(mockRegistryData));
  });

  describe('Validation Functions', () => {
    it('should validate a correct model entry', () => {
      const validEntry = mockRegistryData[0];
      const result = validateModelEntry(validEntry);
      expect(result).toEqual(validEntry);
    });

    it('should throw an error for missing required fields', () => {
      const invalidEntry = {
        // Missing id
        version: 'v1.0.0',
        algorithm: 'LogisticRegression',
        metrics: {
          accuracy: 0.85,
          f1_score: 0.83,
          precision: 0.87,
          recall: 0.79,
        },
        created_at: '2024-01-15T10:30:00.000Z',
        status: 'active',
        file_path: 'models/v1_champion.pkl',
      };

      expect(() => validateModelEntry(invalidEntry)).toThrow();
    });

    it('should throw an error for invalid UUID', () => {
      const invalidEntry = {
        ...mockRegistryData[0],
        id: 'invalid-uuid',
      };

      expect(() => validateModelEntry(invalidEntry)).toThrow();
    });

    it('should throw an error for invalid version format', () => {
      const invalidEntry = {
        ...mockRegistryData[0],
        version: '1.0.0', // Missing 'v' prefix
      };

      expect(() => validateModelEntry(invalidEntry)).toThrow(
        'Version must follow semantic versioning'
      );
    });

    it('should throw an error for invalid status', () => {
      const invalidEntry = {
        ...mockRegistryData[0],
        status: 'invalid-status',
      };

      expect(() => validateModelEntry(invalidEntry)).toThrow();
    });

    it('should throw an error for metrics out of range', () => {
      const invalidEntry = {
        ...mockRegistryData[0],
        metrics: {
          accuracy: 1.5, // Invalid: > 1
          f1_score: 0.83,
          precision: 0.87,
          recall: 0.79,
        },
      };

      expect(() => validateModelEntry(invalidEntry)).toThrow();
    });

    it('should throw an error for invalid datetime', () => {
      const invalidEntry = {
        ...mockRegistryData[0],
        created_at: 'invalid-date',
      };

      expect(() => validateModelEntry(invalidEntry)).toThrow();
    });

    it('should validate a correct model registry', () => {
      const result = validateModelRegistry(mockRegistryData);
      expect(result).toEqual(mockRegistryData);
    });

    it('should throw an error for invalid registry array', () => {
      const invalidRegistry = [
        {
          // Missing required fields
          version: 'v1.0.0',
          algorithm: 'LogisticRegression',
        },
      ];

      expect(() => validateModelRegistry(invalidRegistry)).toThrow();
    });

    it('should throw an error for non-array input', () => {
      const invalidRegistry = {
        // This is an object, not an array
        id: '550e8400-e29b-41d4-a716-446655440000',
        version: 'v1.0.0',
      };

      expect(() => validateModelRegistry(invalidRegistry)).toThrow();
    });
  });

  describe('Helper Functions', () => {
    it('should get all models', async () => {
      const models = await getAllModels();
      expect(models).toEqual(mockRegistryData);
      expect(models).toHaveLength(3);
      expect(mockFetch).toHaveBeenCalledWith(expect.any(Request));
    });

    it('should get active model', async () => {
      const activeModel = await getActiveModel();
      expect(activeModel).toEqual(mockRegistryData[0]);
      expect(activeModel?.status).toBe('active');
    });

    it('should return null when no active models exist', async () => {
      // Mock registry with no active models
      mockFetch.mockResolvedValue(createMockResponse([mockRegistryData[1], mockRegistryData[2]]));

      const activeModel = await getActiveModel();
      expect(activeModel).toBeNull();
    });

    it('should return the most recent active model when multiple exist', async () => {
      const multipleActiveRegistry = [
        mockRegistryData[0], // active, older
        {
          ...mockRegistryData[1],
          id: '550e8400-e29b-41d4-a716-446655440003',
          status: 'active' as ModelStatus,
          created_at: '2024-01-22T10:30:00.000Z', // newer
        },
      ];

      mockFetch.mockResolvedValue(createMockResponse(multipleActiveRegistry));

      const activeModel = await getActiveModel();
      expect(activeModel?.id).toBe('550e8400-e29b-41d4-a716-446655440003');
    });

    it('should get models by status', async () => {
      const candidateModels = await getModelsByStatus('candidate');
      expect(candidateModels).toHaveLength(1);
      expect(candidateModels[0].status).toBe('candidate');

      const archivedModels = await getModelsByStatus('archived');
      expect(archivedModels).toHaveLength(1);
      expect(archivedModels[0].status).toBe('archived');
    });

    it('should get model by ID', async () => {
      const model = await getModelById('550e8400-e29b-41d4-a716-446655440001');
      expect(model).toEqual(mockRegistryData[1]);
      expect(model?.algorithm).toBe('RandomForest');
    });

    it('should return null for non-existent model ID', async () => {
      const model = await getModelById('non-existent-id');
      expect(model).toBeNull();
    });

    it('should handle fetch errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(getAllModels()).rejects.toThrow('Failed to load model registry');
    });

    it('should handle HTTP errors', async () => {
      mockFetch.mockResolvedValue(createMockResponse(null, false, 404));

      await expect(getAllModels()).rejects.toThrow('Failed to fetch model registry: 404');
    });
  });
});

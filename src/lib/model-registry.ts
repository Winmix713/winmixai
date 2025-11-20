import { z } from 'zod';

// Define the schema for model metrics
const ModelMetricsSchema = z.object({
  accuracy: z.number().min(0).max(1),
  f1_score: z.number().min(0).max(1),
  precision: z.number().min(0).max(1),
  recall: z.number().min(0).max(1),
});

// Define the status enum
const ModelStatusSchema = z.enum(['active', 'candidate', 'archived']);

// Define the main model registry entry schema
const ModelRegistryEntrySchema = z.object({
  id: z.string().uuid(),
  version: z.string().regex(/^v\d+\.\d+\.\d+$/, {
    message: 'Version must follow semantic versioning (e.g., v1.0.0)',
  }),
  algorithm: z.string().min(1),
  metrics: ModelMetricsSchema,
  created_at: z.string().datetime(),
  status: ModelStatusSchema,
  file_path: z.string().min(1),
});

// Define the registry schema (array of entries)
const ModelRegistrySchema = z.array(ModelRegistryEntrySchema);

// Export inferred types
export type ModelMetrics = z.infer<typeof ModelMetricsSchema>;
export type ModelStatus = z.infer<typeof ModelStatusSchema>;
export type ModelRegistryEntry = z.infer<typeof ModelRegistryEntrySchema>;
export type ModelRegistry = z.infer<typeof ModelRegistrySchema>;

// Import the registry data
async function loadRegistryData(): Promise<ModelRegistry> {
  try {
    // In a real application, this would be a fetch or fs operation
    // For now, we'll dynamically import the JSON file
    const response = await fetch('/models/model_registry.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch model registry: ${response.status}`);
    }
    const data = await response.json();
    const parsed = ModelRegistrySchema.parse(data);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Model registry validation failed: ${error.errors
          .map(e => `${e.path.join('.')}: ${e.message}`)
          .join(', ')}`
      );
    }
    throw new Error(`Failed to load model registry: ${error}`);
  }
}

// Helper functions
export async function getAllModels(): Promise<ModelRegistryEntry[]> {
  return await loadRegistryData();
}

export async function getActiveModel(): Promise<ModelRegistryEntry | null> {
  const models = await getAllModels();
  const activeModels = models.filter(model => model.status === 'active');
  
  if (activeModels.length === 0) {
    return null;
  }
  
  if (activeModels.length === 1) {
    return activeModels[0];
  }
  
  // If multiple active models exist, return the most recent one
  return activeModels.reduce((latest, current) => 
    new Date(current.created_at) > new Date(latest.created_at) ? current : latest
  );
}

export async function getModelsByStatus(status: ModelStatus): Promise<ModelRegistryEntry[]> {
  const models = await getAllModels();
  return models.filter(model => model.status === status);
}

export async function getModelById(id: string): Promise<ModelRegistryEntry | null> {
  const models = await getAllModels();
  return models.find(model => model.id === id) || null;
}

// Validation utilities
export function validateModelEntry(data: unknown): ModelRegistryEntry {
  return ModelRegistryEntrySchema.parse(data);
}

export function validateModelRegistry(data: unknown): ModelRegistry {
  return ModelRegistrySchema.parse(data);
}

import { z } from 'zod';

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

const originalEnv = process.env;

const mockEnv = {
  GITHUB_TOKEN: 'test-token-123',
  GITHUB_ORG: 'test-org',
  FOLDER: 'test-folder',
};

describe('Environment Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = { ...originalEnv, ...mockEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Environment Schema Validation', () => {
    const envSchema = z.object({
      GITHUB_TOKEN: z.string().min(1, 'GitHub token is required'),
      GITHUB_ORG: z.string().min(1, 'GitHub organization is required'),
      FOLDER: z.string().min(1, 'Folder name is required'),
    });

    it('should validate correct environment variables', () => {
      const result = envSchema.safeParse(mockEnv);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.GITHUB_TOKEN).toBe('test-token-123');
        expect(result.data.GITHUB_ORG).toBe('test-org');
        expect(result.data.FOLDER).toBe('test-folder');
      }
    });

    it('should fail validation when GITHUB_TOKEN is missing', () => {
      const invalidEnv: any = { ...mockEnv };
      delete invalidEnv.GITHUB_TOKEN;

      const result = envSchema.safeParse(invalidEnv);
      expect(result.success).toBe(false);
    });

    it('should fail validation when GITHUB_ORG is empty', () => {
      const invalidEnv = { ...mockEnv, GITHUB_ORG: '' };

      const result = envSchema.safeParse(invalidEnv);
      expect(result.success).toBe(false);
    });

    it('should fail validation when FOLDER is missing', () => {
      const invalidEnv: any = { ...mockEnv };
      delete invalidEnv.FOLDER;

      const result = envSchema.safeParse(invalidEnv);
      expect(result.success).toBe(false);
    });

    it('should provide meaningful error messages', () => {
      const invalidEnv = {
        GITHUB_TOKEN: '',
        GITHUB_ORG: '',
        FOLDER: '',
      };

      const result = envSchema.safeParse(invalidEnv);
      expect(result.success).toBe(false);

      if (!result.success) {
        const errors = result.error.issues.map((issue) => issue.message);
        expect(errors).toContain('GitHub token is required');
        expect(errors).toContain('GitHub organization is required');
        expect(errors).toContain('Folder name is required');
      }
    });
  });

  describe('Environment Variable Loading', () => {
    it('should load environment variables from process.env', () => {
      expect(process.env.GITHUB_TOKEN).toBe('test-token-123');
      expect(process.env.GITHUB_ORG).toBe('test-org');
      expect(process.env.FOLDER).toBe('test-folder');
    });

    it('should handle missing environment variables gracefully', () => {
      delete process.env.GITHUB_TOKEN;
      delete process.env.GITHUB_ORG;
      delete process.env.FOLDER;

      expect(process.env.GITHUB_TOKEN).toBeUndefined();
      expect(process.env.GITHUB_ORG).toBeUndefined();
      expect(process.env.FOLDER).toBeUndefined();
    });

    it('should validate GitHub token format', () => {
      const tokenSchema = z.string().regex(/^[a-zA-Z0-9_-]+$/, 'Invalid token format');

      expect(tokenSchema.safeParse('valid-token_123').success).toBe(true);
      expect(tokenSchema.safeParse('invalid token with spaces').success).toBe(false);
      expect(tokenSchema.safeParse('invalid@token!').success).toBe(false);
    });

    it('should validate organization name format', () => {
      const orgSchema = z.string().regex(/^[a-zA-Z0-9-]+$/, 'Invalid organization name');

      expect(orgSchema.safeParse('valid-org').success).toBe(true);
      expect(orgSchema.safeParse('ValidOrg123').success).toBe(true);
      expect(orgSchema.safeParse('invalid_org').success).toBe(false);
      expect(orgSchema.safeParse('invalid org').success).toBe(false);
    });

    it('should validate folder path format', () => {
      const folderSchema = z
        .string()
        .min(1)
        .refine((path) => !path.includes('..') && !path.startsWith('/'), 'Invalid folder path');

      expect(folderSchema.safeParse('valid-folder').success).toBe(true);
      expect(folderSchema.safeParse('nested/folder').success).toBe(true);
      expect(folderSchema.safeParse('../invalid').success).toBe(false);
      expect(folderSchema.safeParse('/absolute/path').success).toBe(false);
    });
  });

  describe('Environment Module Import', () => {
    it('should successfully import and parse environment variables', async () => {
      process.env.GITHUB_TOKEN = 'test-token-123';

      const { env } = await import('../src/env/env');

      expect(env).toBeDefined();
      expect(env.GITHUB_TOKEN).toBe('test-token-123');
    });

    it('should throw error when GITHUB_TOKEN is missing', async () => {
      delete process.env.GITHUB_TOKEN;

      await expect(async () => {
        await import('../src/env/env');
      }).rejects.toThrow();
    });
  });
});

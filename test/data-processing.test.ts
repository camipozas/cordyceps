describe('Data Processing and Validation', () => {
  describe('Repository Data Processing', () => {
    interface Repository {
      name: string;
      private?: boolean;
      archived?: boolean;
      description?: string;
      language?: string;
      stargazers_count?: number;
      forks_count?: number;
      updated_at?: string;
    }

    it('should filter valid repository names', () => {
      const repositories: Repository[] = [
        { name: 'valid-repo-1' },
        { name: 'valid-repo-2' },
        { name: '' },
        { name: 'valid-repo-3' },
      ];

      const validNames = repositories
        .filter((repo) => repo.name && repo.name.length > 0)
        .map((repo) => repo.name);

      expect(validNames).toEqual(['valid-repo-1', 'valid-repo-2', 'valid-repo-3']);
    });

    it('should filter public repositories', () => {
      const repositories: Repository[] = [
        { name: 'public-repo-1', private: false },
        { name: 'private-repo-1', private: true },
        { name: 'public-repo-2', private: false },
        { name: 'public-repo-3' },
      ];

      const publicRepos = repositories.filter((repo) => !repo.private).map((repo) => repo.name);

      expect(publicRepos).toEqual(['public-repo-1', 'public-repo-2', 'public-repo-3']);
    });

    it('should filter non-archived repositories', () => {
      const repositories: Repository[] = [
        { name: 'active-repo-1', archived: false },
        { name: 'archived-repo-1', archived: true },
        { name: 'active-repo-2', archived: false },
        { name: 'active-repo-3' },
      ];

      const activeRepos = repositories.filter((repo) => !repo.archived).map((repo) => repo.name);

      expect(activeRepos).toEqual(['active-repo-1', 'active-repo-2', 'active-repo-3']);
    });

    it('should sort repositories by name', () => {
      const repositories: Repository[] = [
        { name: 'zebra-repo' },
        { name: 'alpha-repo' },
        { name: 'beta-repo' },
        { name: 'charlie-repo' },
      ];

      const sortedNames = repositories.map((repo) => repo.name).sort();

      expect(sortedNames).toEqual(['alpha-repo', 'beta-repo', 'charlie-repo', 'zebra-repo']);
    });

    it('should sort repositories by star count', () => {
      const repositories: Repository[] = [
        { name: 'repo-a', stargazers_count: 100 },
        { name: 'repo-b', stargazers_count: 500 },
        { name: 'repo-c', stargazers_count: 50 },
        { name: 'repo-d', stargazers_count: 1000 },
      ];

      const sortedByStars = repositories
        .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
        .map((repo) => repo.name);

      expect(sortedByStars).toEqual(['repo-d', 'repo-b', 'repo-a', 'repo-c']);
    });

    it('should group repositories by language', () => {
      const repositories: Repository[] = [
        { name: 'ts-repo-1', language: 'TypeScript' },
        { name: 'js-repo-1', language: 'JavaScript' },
        { name: 'ts-repo-2', language: 'TypeScript' },
        { name: 'py-repo-1', language: 'Python' },
        { name: 'js-repo-2', language: 'JavaScript' },
        { name: 'unknown-repo', language: undefined },
      ];

      const groupedByLanguage = repositories.reduce(
        (groups, repo) => {
          const language = repo.language || 'Unknown';
          if (!groups[language]) {
            groups[language] = [];
          }
          groups[language].push(repo.name);
          return groups;
        },
        {} as Record<string, string[]>,
      );

      expect(groupedByLanguage).toEqual({
        TypeScript: ['ts-repo-1', 'ts-repo-2'],
        JavaScript: ['js-repo-1', 'js-repo-2'],
        Python: ['py-repo-1'],
        Unknown: ['unknown-repo'],
      });
    });

    it('should calculate repository statistics', () => {
      const repositories: Repository[] = [
        { name: 'repo-1', stargazers_count: 100, forks_count: 20 },
        { name: 'repo-2', stargazers_count: 200, forks_count: 40 },
        { name: 'repo-3', stargazers_count: 50, forks_count: 10 },
        { name: 'repo-4', stargazers_count: undefined, forks_count: undefined },
      ];

      const totalStars = repositories.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
      const totalForks = repositories.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);
      const avgStars =
        totalStars / repositories.filter((repo) => repo.stargazers_count !== undefined).length;

      expect(totalStars).toBe(350);
      expect(totalForks).toBe(70);
      expect(avgStars).toBeCloseTo(116.67, 2);
    });

    it('should handle malformed repository data gracefully', () => {
      const malformedData: any[] = [
        { name: 'valid-repo', private: false },
        null,
        undefined,
        { name: null, private: false },
        { name: '', private: false },
        { /* missing name */ private: false },
        { name: 'another-valid-repo', private: true },
      ];

      const validRepos = malformedData
        .filter((repo: any): repo is Repository => {
          return (
            repo !== null &&
            repo !== undefined &&
            typeof repo === 'object' &&
            'name' in repo &&
            typeof repo.name === 'string' &&
            repo.name.length > 0
          );
        })
        .map((repo) => repo.name);

      expect(validRepos).toEqual(['valid-repo', 'another-valid-repo']);
    });
  });

  describe('URL and Path Validation', () => {
    it('should validate GitHub repository URLs', () => {
      const testUrls = [
        { url: 'https://github.com/owner/repo', valid: true },
        { url: 'https://github.com/owner-with-dashes/repo-with-dashes', valid: true },
        { url: 'https://github.com/owner_with_underscores/repo_with_underscores', valid: true },
        { url: 'https://github.com/owner123/repo456', valid: true },
        { url: 'http://github.com/owner/repo', valid: false }, // should be https
        { url: 'https://gitlab.com/owner/repo', valid: false }, // wrong domain
        { url: 'https://github.com/owner', valid: false }, // missing repo
        { url: 'invalid-url', valid: false },
        { url: '', valid: false },
      ];

      testUrls.forEach(({ url, valid }) => {
        const isValid = /^https:\/\/github\.com\/[^/]+\/[^/]+$/.test(url);
        expect(isValid).toBe(valid);
      });
    });

    it('should extract owner and repo from GitHub URLs', () => {
      const testCases = [
        { url: 'https://github.com/facebook/react', owner: 'facebook', repo: 'react' },
        { url: 'https://github.com/microsoft/vscode', owner: 'microsoft', repo: 'vscode' },
        { url: 'https://github.com/test-org/test-repo', owner: 'test-org', repo: 'test-repo' },
      ];

      testCases.forEach(({ url, owner, repo }) => {
        const match = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)$/);
        if (match) {
          expect(match[1]).toBe(owner);
          expect(match[2]).toBe(repo);
        }
      });
    });

    it('should validate local file paths', () => {
      const testPaths = [
        { path: '/home/user/projects/repo', valid: true },
        { path: '/Users/dev/workspace/project', valid: true },
        { path: 'C:\\Users\\Dev\\Code\\App', valid: true },
        { path: './relative/path', valid: true },
        { path: '../parent/path', valid: true },
        { path: '', valid: false },
        { path: '/', valid: true }, // root is valid but not recommended
        { path: 'simple-path', valid: true },
      ];

      testPaths.forEach(({ path, valid }) => {
        const isValid = path.length > 0;
        expect(isValid).toBe(valid);
      });
    });
  });

  describe('Environment Variable Processing', () => {
    it('should validate required environment variables', () => {
      const envVars = {
        GITHUB_TOKEN: 'ghp_1234567890abcdef',
        GITHUB_ORG: 'my-organization',
        FOLDER: 'my-projects',
      };

      const requiredVars = ['GITHUB_TOKEN', 'GITHUB_ORG', 'FOLDER'];
      const missingVars = requiredVars.filter(
        (varName) => !envVars[varName as keyof typeof envVars],
      );

      expect(missingVars).toEqual([]);
    });

    it('should identify missing environment variables', () => {
      const envVars = {
        GITHUB_TOKEN: 'ghp_1234567890abcdef',
        // GITHUB_ORG is missing
        FOLDER: 'my-projects',
      };

      const requiredVars = ['GITHUB_TOKEN', 'GITHUB_ORG', 'FOLDER'];
      const missingVars = requiredVars.filter(
        (varName) => !envVars[varName as keyof typeof envVars],
      );

      expect(missingVars).toEqual(['GITHUB_ORG']);
    });

    it('should validate GitHub token format', () => {
      const testTokens = [
        { token: 'ghp_1234567890abcdef1234567890abcdef123456', valid: true },
        { token: 'github_pat_11ABCDEFGHIJKLMNOPQRSTUVWXYZ', valid: true },
        { token: 'gho_1234567890abcdef1234567890abcdef123456', valid: true },
        { token: 'invalid-token', valid: false },
        { token: '', valid: false },
        { token: '1234567890', valid: false },
      ];

      testTokens.forEach(({ token, valid }) => {
        // Basic GitHub token format validation
        const isValid =
          /^(ghp_|github_pat_|gho_|ghr_|ghs_)[a-zA-Z0-9_]+$/.test(token) && token.length >= 30;
        expect(isValid).toBe(valid);
      });
    });

    it('should validate organization names', () => {
      const testOrgs = [
        { org: 'facebook', valid: true },
        { org: 'microsoft', valid: true },
        { org: 'my-organization', valid: true },
        { org: 'org_with_underscores', valid: true },
        { org: 'org123', valid: true },
        { org: '', valid: false },
        { org: 'org with spaces', valid: false },
        { org: 'org/with/slashes', valid: false },
      ];

      testOrgs.forEach(({ org, valid }) => {
        // GitHub organization name validation
        const isValid = /^[a-zA-Z0-9_-]+$/.test(org) && org.length > 0;
        expect(isValid).toBe(valid);
      });
    });
  });

  describe('Error Processing', () => {
    it('should categorize different types of errors', () => {
      const errors = [
        new Error('API rate limit exceeded'),
        new Error('Not Found'),
        new Error('Bad credentials'),
        new Error('Network timeout'),
        new Error('Permission denied'),
      ];

      const categorizedErrors = errors.reduce(
        (categories, error) => {
          if (error.message.includes('rate limit')) {
            categories.rateLimiting.push(error);
          } else if (error.message.includes('Not Found')) {
            categories.notFound.push(error);
          } else if (error.message.includes('credentials')) {
            categories.authentication.push(error);
          } else if (error.message.includes('timeout') || error.message.includes('Network')) {
            categories.network.push(error);
          } else {
            categories.other.push(error);
          }
          return categories;
        },
        {
          rateLimiting: [] as Error[],
          notFound: [] as Error[],
          authentication: [] as Error[],
          network: [] as Error[],
          other: [] as Error[],
        },
      );

      expect(categorizedErrors.rateLimiting).toHaveLength(1);
      expect(categorizedErrors.notFound).toHaveLength(1);
      expect(categorizedErrors.authentication).toHaveLength(1);
      expect(categorizedErrors.network).toHaveLength(1);
      expect(categorizedErrors.other).toHaveLength(1);
    });

    it('should handle error objects with various properties', () => {
      const errors = [
        { message: 'Error 1', status: 404 },
        { message: 'Error 2', code: 'ENOTFOUND' },
        { message: 'Error 3', errno: -2 },
        new Error('Standard error'),
        'String error',
      ];

      const processedErrors = errors.map((error) => {
        if (typeof error === 'string') {
          return { message: error, type: 'string' };
        } else if (error instanceof Error) {
          return { message: error.message, type: 'Error' };
        } else if (typeof error === 'object' && error.message) {
          return {
            message: error.message,
            type: 'object',
            hasStatus: 'status' in error,
            hasCode: 'code' in error,
          };
        }
        return { message: 'Unknown error', type: 'unknown' };
      });

      expect(processedErrors).toHaveLength(5);
      expect(processedErrors[0].type).toBe('object');
      expect(processedErrors[3].type).toBe('Error');
      expect(processedErrors[4].type).toBe('string');
    });
  });
});

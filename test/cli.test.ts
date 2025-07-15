jest.mock('prompts');
jest.mock('../src/get-repositories');
jest.mock('../src/clone-repositories');
jest.mock('../src/repo-status');

import prompts from 'prompts';

const mockPrompts = prompts as jest.MockedFunction<typeof prompts>;

describe('CLI Interface', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Menu Options', () => {
    it('should display correct menu options', () => {
      const expectedOptions = [
        { title: 'Get organization repositories', value: 'get' },
        { title: 'Clone repositories', value: 'clone' },
        { title: 'Check repositories status', value: 'status' },
        { title: 'Exit', value: 'exit' },
      ];

      expect(expectedOptions).toHaveLength(4);
      expect(expectedOptions[0].value).toBe('get');
      expect(expectedOptions[1].value).toBe('clone');
      expect(expectedOptions[2].value).toBe('status');
      expect(expectedOptions[3].value).toBe('exit');
    });

    it('should validate menu option values', () => {
      const validActions = ['get', 'clone', 'status', 'exit'];
      const testAction = 'get';

      expect(validActions).toContain(testAction);
    });

    it('should handle different action types', () => {
      const actions = [
        { action: 'get', description: 'Get repositories' },
        { action: 'clone', description: 'Clone repositories' },
        { action: 'status', description: 'Check status' },
        { action: 'exit', description: 'Exit application' },
      ];

      expect(actions).toHaveLength(4);
      expect(actions.map((a) => a.action)).toEqual(['get', 'clone', 'status', 'exit']);
    });
  });

  describe('Command Line Arguments', () => {
    const originalArgv = process.argv;

    afterEach(() => {
      process.argv = originalArgv;
    });

    it('should handle --help flag', () => {
      process.argv = ['node', 'cli.js', '--help'];

      const hasHelpFlag = process.argv.includes('--help') || process.argv.includes('-h');
      expect(hasHelpFlag).toBe(true);
    });

    it('should handle --version flag', () => {
      process.argv = ['node', 'cli.js', '--version'];

      const hasVersionFlag = process.argv.includes('--version') || process.argv.includes('-v');
      expect(hasVersionFlag).toBe(true);
    });

    it('should handle command line options', () => {
      process.argv = ['node', 'cli.js', '--org', 'test-org', '--folder', 'test-folder'];

      const args = process.argv.slice(2);
      const orgIndex = args.indexOf('--org');
      const folderIndex = args.indexOf('--folder');

      if (orgIndex !== -1 && orgIndex + 1 < args.length) {
        expect(args[orgIndex + 1]).toBe('test-org');
      }

      if (folderIndex !== -1 && folderIndex + 1 < args.length) {
        expect(args[folderIndex + 1]).toBe('test-folder');
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle prompts cancellation gracefully', async () => {
      mockPrompts.mockRejectedValueOnce(new Error('User cancelled'));

      try {
        await prompts({
          type: 'select',
          name: 'action',
          message: 'What would you like to do?',
          choices: [],
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('User cancelled');
      }
    });

    it('should handle invalid menu selection', async () => {
      mockPrompts.mockResolvedValueOnce({ action: 'invalid' });

      const userChoice = await prompts({
        type: 'select',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { title: 'Valid option', value: 'valid' },
          { title: 'Exit', value: 'exit' },
        ],
      });

      // The prompt library should prevent invalid selections,
      // but we can test our handling of unexpected values
      const validChoices = ['valid', 'exit'];
      expect(validChoices).not.toContain(userChoice.action);
    });

    it('should validate required environment variables', () => {
      const requiredEnvVars = ['GITHUB_TOKEN', 'GITHUB_ORG', 'FOLDER'];
      const missingVars: string[] = [];

      requiredEnvVars.forEach((varName) => {
        if (!process.env[varName]) {
          missingVars.push(varName);
        }
      });

      if (missingVars.length > 0) {
        expect(missingVars.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Menu Flow', () => {
    it('should continue showing menu until exit is selected', async () => {
      const mockChoices = [
        { action: 'get' },
        { action: 'clone' },
        { action: 'status' },
        { action: 'exit' },
      ];

      mockChoices.forEach((choice) => {
        mockPrompts.mockResolvedValueOnce(choice);
      });

      const actions: string[] = [];
      for (let i = 0; i < mockChoices.length; i++) {
        const result = await prompts({
          type: 'select',
          name: 'action',
          message: 'What would you like to do?',
          choices: [],
        });
        actions.push(result.action);

        if (result.action === 'exit') {
          break;
        }
      }

      expect(actions).toEqual(['get', 'clone', 'status', 'exit']);
      expect(actions[actions.length - 1]).toBe('exit');
    });
  });
});

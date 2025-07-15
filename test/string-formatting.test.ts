describe('String and Formatting Utilities', () => {
  describe('Command Line Argument Processing', () => {
    it('should parse command line flags correctly', () => {
      const testArgs = [
        'node',
        'script.js',
        '--help',
        '--version',
        '--org=test-org',
        '--folder=my-projects',
        '--clone',
        '--status',
      ];

      const parseArgs = (args: string[]) => {
        const flags: Record<string, string | boolean> = {};

        for (let i = 2; i < args.length; i++) {
          const arg = args[i];
          if (arg.startsWith('--')) {
            if (arg.includes('=')) {
              const [key, value] = arg.slice(2).split('=');
              flags[key] = value;
            } else {
              flags[arg.slice(2)] = true;
            }
          }
        }

        return flags;
      };

      const parsed = parseArgs(testArgs);

      expect(parsed).toEqual({
        help: true,
        version: true,
        org: 'test-org',
        folder: 'my-projects',
        clone: true,
        status: true,
      });
    });

    it('should handle mixed argument formats', () => {
      const testArgs = [
        'node',
        'script.js',
        '--org',
        'separate-value',
        '--folder=combined-value',
        '--flag-only',
      ];

      const parseComplexArgs = (args: string[]) => {
        const flags: Record<string, string | boolean> = {};

        for (let i = 2; i < args.length; i++) {
          const arg = args[i];
          if (arg.startsWith('--')) {
            if (arg.includes('=')) {
              const [key, value] = arg.slice(2).split('=');
              flags[key] = value;
            } else {
              const key = arg.slice(2);
              // Check if next argument is a value (doesn't start with --)
              if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
                flags[key] = args[i + 1];
                i++; // Skip the next argument as it's been consumed
              } else {
                flags[key] = true;
              }
            }
          }
        }

        return flags;
      };

      const parsed = parseComplexArgs(testArgs);

      expect(parsed).toEqual({
        'org': 'separate-value',
        'folder': 'combined-value',
        'flag-only': true,
      });
    });
  });

  describe('Console Output Formatting', () => {
    it('should format success messages consistently', () => {
      const formatSuccess = (message: string) => `✅ ${message}`;

      const testMessages = [
        'Repository cloned successfully',
        'All repositories are up to date',
        'Configuration saved',
      ];

      const formatted = testMessages.map(formatSuccess);

      expect(formatted).toEqual([
        '✅ Repository cloned successfully',
        '✅ All repositories are up to date',
        '✅ Configuration saved',
      ]);
    });

    it('should format error messages consistently', () => {
      const formatError = (message: string) => `❌ ${message}`;

      const testMessages = [
        'Failed to clone repository',
        'API rate limit exceeded',
        'Invalid configuration',
      ];

      const formatted = testMessages.map(formatError);

      expect(formatted).toEqual([
        '❌ Failed to clone repository',
        '❌ API rate limit exceeded',
        '❌ Invalid configuration',
      ]);
    });

    it('should format info messages consistently', () => {
      const formatInfo = (message: string) => `ℹ️ ${message}`;

      const testMessages = [
        'Checking repository status',
        'Found 5 repositories',
        'Processing complete',
      ];

      const formatted = testMessages.map(formatInfo);

      expect(formatted).toEqual([
        'ℹ️ Checking repository status',
        'ℹ️ Found 5 repositories',
        'ℹ️ Processing complete',
      ]);
    });

    it('should format warning messages consistently', () => {
      const formatWarning = (message: string) => `⚠️ ${message}`;

      const testMessages = [
        'Repository already exists',
        'Some repositories could not be accessed',
        'Rate limit approaching',
      ];

      const formatted = testMessages.map(formatWarning);

      expect(formatted).toEqual([
        '⚠️ Repository already exists',
        '⚠️ Some repositories could not be accessed',
        '⚠️ Rate limit approaching',
      ]);
    });

    it('should format progress messages with counts', () => {
      const formatProgress = (current: number, total: number, action: string) =>
        `🚀 ${action} (${current}/${total})`;

      const testCases = [
        { current: 1, total: 10, action: 'Cloning repositories' },
        { current: 5, total: 10, action: 'Checking status' },
        { current: 10, total: 10, action: 'Complete' },
      ];

      const formatted = testCases.map(({ current, total, action }) =>
        formatProgress(current, total, action),
      );

      expect(formatted).toEqual([
        '🚀 Cloning repositories (1/10)',
        '🚀 Checking status (5/10)',
        '🚀 Complete (10/10)',
      ]);
    });
  });

  describe('Path and URL Processing', () => {
    it('should normalize file paths', () => {
      const normalizePath = (path: string) => {
        return path
          .replace(/\\/g, '/') // Convert backslashes to forward slashes
          .replace(/\/+/g, '/') // Remove duplicate slashes
          .replace(/\/$/, ''); // Remove trailing slash
      };

      const testPaths = [
        'C:\\Users\\Dev\\Projects',
        '/home//user///projects/',
        './relative/path/',
        '../parent//directory',
      ];

      const normalized = testPaths.map(normalizePath);

      expect(normalized).toEqual([
        'C:/Users/Dev/Projects',
        '/home/user/projects',
        './relative/path',
        '../parent/directory',
      ]);
    });

    it('should extract repository name from URL', () => {
      const extractRepoName = (url: string) => {
        const match = url.match(/\/([^/]+)(?:\.git)?$/);
        return match ? match[1].replace(/\.git$/, '') : null;
      };

      const testUrls = [
        'https://github.com/owner/repo',
        'https://github.com/owner/repo.git',
        'git@github.com:owner/repo.git',
        'https://github.com/owner/repo-name-with-dashes',
        'invalid-url',
      ];

      const extracted = testUrls.map(extractRepoName);

      expect(extracted).toEqual(['repo', 'repo', 'repo', 'repo-name-with-dashes', null]);
    });

    it('should validate and clean repository names', () => {
      const cleanRepoName = (name: string) => {
        return name
          .toLowerCase()
          .replace(/[^a-z0-9-_]/g, '-') // Replace invalid chars with dashes
          .replace(/-+/g, '-') // Remove duplicate dashes
          .replace(/^-|-$/g, ''); // Remove leading/trailing dashes
      };

      const testNames = [
        'MyAwesomeRepo',
        'repo with spaces',
        'repo--with--dashes',
        'repo.with.dots',
        'repo_with_underscores',
        '-leading-and-trailing-',
      ];

      const cleaned = testNames.map(cleanRepoName);

      expect(cleaned).toEqual([
        'myawesomerepo',
        'repo-with-spaces',
        'repo-with-dashes',
        'repo-with-dots',
        'repo_with_underscores',
        'leading-and-trailing',
      ]);
    });
  });

  describe('Data Formatting', () => {
    it('should format file sizes', () => {
      const formatFileSize = (bytes: number) => {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
          size /= 1024;
          unitIndex++;
        }

        return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
      };

      const testSizes = [
        512, // 512 B
        1024, // 1.0 KB
        1536, // 1.5 KB
        1048576, // 1.0 MB
        1073741824, // 1.0 GB
        5368709120, // 5.0 GB
      ];

      const formatted = testSizes.map(formatFileSize);

      expect(formatted).toEqual(['512 B', '1.0 KB', '1.5 KB', '1.0 MB', '1.0 GB', '5.0 GB']);
    });

    it('should format duration', () => {
      const formatDuration = (milliseconds: number) => {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
          return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
          return `${minutes}m ${seconds % 60}s`;
        } else {
          return `${seconds}s`;
        }
      };

      const testDurations = [
        1000, // 1 second
        65000, // 1 minute 5 seconds
        3665000, // 1 hour 1 minute 5 seconds
        30000, // 30 seconds
        120000, // 2 minutes
      ];

      const formatted = testDurations.map(formatDuration);

      expect(formatted).toEqual(['1s', '1m 5s', '1h 1m 5s', '30s', '2m 0s']);
    });

    it('should format timestamps', () => {
      const formatTimestamp = (date: Date) => {
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format
      };

      const testDates = [
        new Date('2023-01-01T12:00:00Z'),
        new Date('2023-12-31T23:59:59Z'),
        new Date('2024-06-15T06:30:00Z'),
      ];

      const formatted = testDates.map(formatTimestamp);

      expect(formatted).toEqual(['2023-01-01', '2023-12-31', '2024-06-15']);
    });

    it('should truncate long text', () => {
      const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) {
          return text;
        }
        return text.substring(0, maxLength - 3) + '...';
      };

      const testTexts = [
        { text: 'Short text', maxLength: 20 },
        { text: 'This is a very long text that should be truncated', maxLength: 20 },
        { text: 'Medium length text here', maxLength: 25 },
        { text: 'Exact', maxLength: 5 },
      ];

      const truncated = testTexts.map(({ text, maxLength }) => truncateText(text, maxLength));

      expect(truncated).toEqual([
        'Short text',
        'This is a very lo...',
        'Medium length text here',
        'Exact',
      ]);
    });
  });

  describe('Menu and Interface Formatting', () => {
    it('should format menu options consistently', () => {
      const formatMenuOption = (index: number, title: string, description?: string) => {
        const base = `${index + 1}. ${title}`;
        return description ? `${base} - ${description}` : base;
      };

      const menuItems = [
        { title: 'Get repositories', description: 'Fetch all org repositories' },
        { title: 'Clone repositories', description: 'Clone to local directory' },
        { title: 'Check status', description: undefined },
        { title: 'Exit' },
      ];

      const formatted = menuItems.map((item, index) =>
        formatMenuOption(index, item.title, item.description),
      );

      expect(formatted).toEqual([
        '1. Get repositories - Fetch all org repositories',
        '2. Clone repositories - Clone to local directory',
        '3. Check status',
        '4. Exit',
      ]);
    });

    it('should format table headers and rows', () => {
      const formatTable = (headers: string[], rows: string[][]) => {
        const columnWidths = headers.map((header, index) => {
          const maxRowWidth = Math.max(...rows.map((row) => (row[index] || '').length));
          return Math.max(header.length, maxRowWidth);
        });

        const formatRow = (row: string[]) => {
          return row.map((cell, index) => cell.padEnd(columnWidths[index])).join(' | ');
        };

        const headerRow = formatRow(headers);
        const separator = columnWidths.map((width) => '-'.repeat(width)).join('-+-');
        const dataRows = rows.map(formatRow);

        return [headerRow, separator, ...dataRows].join('\n');
      };

      const headers = ['Name', 'Status', 'Stars'];
      const rows = [
        ['repo-1', 'Active', '100'],
        ['repository-with-long-name', 'Archived', '1.5K'],
        ['repo-3', 'Active', '50'],
      ];

      const table = formatTable(headers, rows);
      const lines = table.split('\n');

      expect(lines).toHaveLength(5); // header + separator + 3 data rows
      expect(lines[0]).toContain('Name');
      expect(lines[1]).toMatch(/^-/); // separator line
      expect(lines[2]).toContain('repo-1');
    });
  });
});

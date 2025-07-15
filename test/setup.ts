// Mock console methods to avoid cluttering test output
global.console = {
  ...console,
  // Uncomment to suppress console.log during tests
  // log: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Mock process.stdout for ProgressBar tests
const mockStdout = {
  columns: 80,
  clearLine: jest.fn(),
  cursorTo: jest.fn(),
  write: jest.fn(),
};

Object.defineProperty(process, 'stdout', {
  value: mockStdout,
  writable: true,
});

export { mockStdout };

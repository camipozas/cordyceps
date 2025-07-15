import ProgressBar from '../src/utils/progress-bar';

jest.mock('chalk', () => ({
  __esModule: true,
  default: {
    blueBright: {
      bold: (str: string) => str,
    },
    bgWhiteBright: (str: string) => str,
  },
}));

describe('ProgressBar Basic Tests', () => {
  let mockStdout: any;
  let originalStdout: any;

  beforeEach(() => {
    originalStdout = process.stdout;
    mockStdout = {
      columns: 80,
      clearLine: jest.fn(),
      cursorTo: jest.fn(),
      write: jest.fn(),
    };

    Object.defineProperty(process, 'stdout', {
      value: mockStdout,
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(process, 'stdout', {
      value: originalStdout,
      writable: true,
    });
  });

  describe('ProgressBar', () => {
    let progressBar: ProgressBar;

    beforeEach(() => {
      progressBar = new ProgressBar('Test Progress');
    });

    it('should initialize with default values', () => {
      const defaultProgressBar = new ProgressBar();
      expect(defaultProgressBar.total).toBe(0);
      expect(defaultProgressBar.current).toBe(0);
      expect(defaultProgressBar.name).toBe('Current progress');
    });

    it('should initialize with custom name', () => {
      expect(progressBar.name).toBe('Test Progress');
      expect(progressBar.total).toBe(0);
      expect(progressBar.current).toBe(0);
    });

    it('should calculate barLength based on terminal width', () => {
      expect(progressBar.barLength).toBe(20); // 80 - 60 = 20
    });

    it('should set total and reset current progress', () => {
      const total = 100;
      progressBar.init(total);

      expect(progressBar.total).toBe(total);
      expect(progressBar.current).toBe(0);
    });

    it('should update current progress', () => {
      progressBar.init(100);
      progressBar.update(25);
      expect(progressBar.current).toBe(25);
    });

    it('should write progress to stdout', () => {
      progressBar.init(100);
      progressBar.update(50);

      expect(mockStdout.clearLine).toHaveBeenCalledWith(0);
      expect(mockStdout.cursorTo).toHaveBeenCalledWith(0);
      expect(mockStdout.write).toHaveBeenCalled();
    });

    it('should handle zero progress', () => {
      progressBar.init(100);
      progressBar.update(0);

      expect(mockStdout.write).toHaveBeenCalled();
      const writeCall = mockStdout.write.mock.calls[mockStdout.write.mock.calls.length - 1][0];
      expect(writeCall).toContain('0.00%');
    });

    it('should handle complete progress', () => {
      progressBar.init(100);
      progressBar.update(100);

      expect(mockStdout.write).toHaveBeenCalled();
      const writeCall = mockStdout.write.mock.calls[mockStdout.write.mock.calls.length - 1][0];
      expect(writeCall).toContain('100.00%');
    });
  });
});

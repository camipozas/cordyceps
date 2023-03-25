import chalk from 'chalk';

/* It draws a progress bar in the terminal */
export default class ProgressBar {
  total: number;
  current: number;
  barLength: number;
  name: string;
  startTime: number;

  constructor(name = 'Current progress') {
    this.total = 0;
    this.current = 0;
    this.barLength = process.stdout.columns - 60;
    this.name = name;
    this.startTime = Date.now();
  }

  init(total: number): void {
    this.total = total;
    this.current = 0;
    this.startTime = Date.now();
    this.update(this.current);
  }

  update(current: number): void {
    this.current = current;
    const currentProgress = this.current / this.total;
    const elapsedTime = (Date.now() - this.startTime) / 1000; // in seconds
    const estimatedTime = (elapsedTime / currentProgress) * (1 - currentProgress); // in seconds
    this.draw(currentProgress, estimatedTime);
  }

  draw(currentProgress: number, estimatedTime: number): void {
    const filledBarLength = Math.floor(currentProgress * this.barLength);
    const emptyBarLength = this.barLength - filledBarLength;
    const nameFormatted = chalk.blueBright.bold(this.name);
    const filledBar = this.getBar(filledBarLength, ' ', chalk.bgWhiteBright);
    const emptyBar = this.getBar(emptyBarLength, '-');
    const percentageProgress = (currentProgress * 100).toFixed(2);

    const minutesRemaining = Math.floor(estimatedTime / 60);
    const secondsRemaining = Math.floor(estimatedTime % 60);

    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(
      `${nameFormatted}: [${filledBar}${emptyBar}] | ${percentageProgress}% | ETA: ${minutesRemaining}m ${secondsRemaining}s`,
    );
  }

  private getBar(length: number, char: string, color: (str: string) => string = (a) => a): string {
    let str = '';
    for (let i = 0; i < length; i++) {
      str += char;
    }
    return color(str);
  }
}

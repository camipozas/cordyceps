import chalk from 'chalk';

/* It draws a progress bar in the terminal */
export default class ProgressBar {
  total: number;
  current: number;
  barLength: number;
  name: string;

  constructor(name = 'Current progress') {
    this.total = 0;
    this.current = 0;
    this.barLength = process.stdout.columns - 40;
    this.name = name;
  }

  init(total: number): void {
    this.total = total;
    this.current = 0;
    this.update(this.current);
  }

  update(current: number): void {
    this.current = current;
    const currentProgress = this.current / this.total;
    this.draw(currentProgress);
  }

  draw(currentProgress: number): void {
    const filledBarLength = Math.floor(currentProgress * this.barLength);
    const emptyBarLength = this.barLength - filledBarLength;
    const nameFormatted = chalk.blueBright.bold(this.name);
    const filledBar = this.getBar(filledBarLength, ' ', chalk.bgWhiteBright);
    const emptyBar = this.getBar(emptyBarLength, '-');
    const percentageProgress = (currentProgress * 100).toFixed(2);

    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`${nameFormatted}: [${filledBar}${emptyBar}] | ${percentageProgress}%`);
  }

  private getBar(length: number, char: string, color: (str: string) => string = (a) => a): string {
    let str = '';
    for (let i = 0; i < length; i++) {
      str += char;
    }
    return color(str);
  }
}
